import { IWorkspaceRepository, WorkspaceWithRelations } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { PrismaClient, Workspace } from "@/src/generated/prisma";
import { createPrismaClient } from "@/lib/prisma";
import { D1Database } from "@cloudflare/workers-types";

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
                const workspaceMember = await this.prisma.workspaceMember.create({
                    data: {
                        workspaceId: workspace.id,
                        userId: createdBy,
                    }
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
                    throw new Error('워크스페이스 조회에 실패했습니다.');
                }

                return createdWorkspace;
            } catch (error) {
                await this.prisma.workspace.delete({
                    where: { id: workspace.id }
                });
                throw error;
            }
        } catch (error) {
            throw new Error("워크스페이스 생성 중 오류가 발생했습니다: " + error);
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
}