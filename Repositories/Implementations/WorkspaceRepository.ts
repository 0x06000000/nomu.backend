import { IWorkspaceRepository, WorkspaceWithRelations } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { PrismaClient } from "@/src/generated/prisma";
import { createPrismaClient } from "@/lib/prisma";
import { D1Database } from "@cloudflare/workers-types";
import { MemberWithRelations } from "../Interfaces/IMemberRepository";
import { InternalServerErrorException, NotFoundException } from "@/Exceptions/Exceptions";

export class WorkspaceRepository implements IWorkspaceRepository {
    private prisma: PrismaClient;

    constructor(db: D1Database) {
        this.prisma = createPrismaClient(db);
    }

    async existsMember(workspaceId: number, userId: number): Promise<boolean> {
        const member = await this.prisma.workspaceMember.findFirst({
            where: { workspaceId, userId },
            select: { id: true }
        });

        return member !== null;
    }

    async add(name: string, createdBy: number): Promise<WorkspaceWithRelations> {
        try {
            const workspace = await this.prisma.workspace.create({
                data: {
                    name,
                },
                include: {
                    companies: true,
                    sites: true,
                    talentPools: true,
                    workspaceMembers: true,
                    workspaceOwners: true
                }
            });

            try {
                const user = await this.prisma.user.findUnique({
                    where: { id: createdBy },
                    select: { primaryProfile: { select: { id: true } } }
                });

                if (!user?.primaryProfile) {
                    throw new NotFoundException("사용자의 프로필을 찾을 수 없습니다.");
                }

                const workspaceMember = await this.prisma.workspaceMember.create({
                    data: {
                        workspaceId: workspace.id,
                        userId: createdBy,
                        profileId: user?.primaryProfile.id
                    },
                });

                await this.prisma.workspaceOwner.create({
                    data: {
                        workspaceId: workspace.id,
                        workspaceMemberId: workspaceMember.id
                    }
                });

                const createdWorkspace = await this.prisma.workspace.findUnique({
                    where: { id: workspace.id },
                    include: {
                        companies: true,
                        sites: true,
                        talentPools: true,
                        workspaceMembers: true,
                        workspaceOwners: true
                    }
                });

                if (!createdWorkspace) {
                    throw new NotFoundException('워크스페이스 조회에 실패했습니다.');
                }

                return createdWorkspace;
            } catch (error) {
                await this.prisma.workspace.delete({
                    where: { id: workspace.id }
                });
                throw error;
            }
        } catch (error) {
            throw new InternalServerErrorException("워크스페이스 생성 중 오류가 발생했습니다: " + error);
        }
    }

    async update(workspaceId: number, name: string): Promise<WorkspaceWithRelations> {
        const updatedWorkspace = await this.prisma.workspace.update({
            where: { id: workspaceId },
            data: { name },
            include: {
                companies: true,
                sites: true,
                talentPools: true,
                workspaceMembers: true,
                workspaceOwners: true
            }
        });

        return updatedWorkspace;
    }

    async delete(workspaceId: number): Promise<void> {
        await this.prisma.workspace.delete({
            where: { id: workspaceId }
        });
    }

    async getById(workspaceId: number): Promise<WorkspaceWithRelations | null> {
        const workspace = await this.prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: {
                companies: true,
                sites: true,
                talentPools: true,
                workspaceMembers: true,
                workspaceOwners: true
            }
        });

        return workspace;
    }

    async getByUserId(userId: number): Promise<WorkspaceWithRelations[]> {
        const workspaces = await this.prisma.workspace.findMany({
            where: { workspaceMembers: { some: { userId } } },
            include: {
                companies: true,
                sites: true,
                talentPools: true,
                workspaceMembers: true,
                workspaceOwners: true
            }
        });

        return workspaces;
    }

    async inviteByUserId(workspaceId: number, inviterId: number, inviteeId: number): Promise<MemberWithRelations> {
        const user = await this.prisma.user.findUnique({
            where: { id: inviteeId },
            select: { primaryProfile: { select: { id: true } } }
        });

        if (!user?.primaryProfile) {
            throw new Error("사용자의 프로필을 찾을 수 없습니다.");
        }

        const member = await this.prisma.workspaceMember.create({
            data: { workspaceId, userId: inviteeId, inviterId, profileId: user?.primaryProfile.id },
            include: {
                user: true,
                inviter: true,
                workspace: true
            }
        });

        return member;
    }

    async inviteByEmail(workspaceId: number, inviterId: number, email: string): Promise<MemberWithRelations> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: { id: true }
        });

        if (!user) {
            throw new Error("사용자를 찾을 수 없습니다.");
        }

        return this.inviteByUserId(workspaceId, inviterId, user.id);
    }
}