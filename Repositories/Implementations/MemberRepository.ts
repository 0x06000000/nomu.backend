import { IMemberRepository, MemberWithRelations } from "@/Repositories/Interfaces/IMemberRepository";
import { PrismaClient } from "@/src/generated/prisma";
import { createPrismaClient } from "@/lib/prisma";
import { D1Database } from "@cloudflare/workers-types";
import { NotFoundException } from "@/Exceptions/Exceptions";

export class MemberRepository implements IMemberRepository {
    private prisma: PrismaClient;

    constructor(db: D1Database) {
        this.prisma = createPrismaClient(db);
    }

    async getByWorkspaceId(workspaceId: number): Promise<MemberWithRelations[]> {
        const members = await this.prisma.workspaceMember.findMany({
            where: { workspaceId },
            include: { user: true, workspace: true, inviter: true },
        });
        return members;
    }

    async getByUserId(userId: number): Promise<MemberWithRelations | null> {
        const member = await this.prisma.workspaceMember.findFirst({
            where: { userId },
            include: { user: true, workspace: true, inviter: true },
        });
        return member;
    }

    async getByWorkspaceIdAndUserId(workspaceId: number, userId: number): Promise<MemberWithRelations | null> {
        const member = await this.prisma.workspaceMember.findFirst({
            where: { workspaceId, userId },
            include: { user: true, workspace: true, inviter: true },
        });
        return member;
    }

    async add(workspaceId: number, userId: number): Promise<MemberWithRelations> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                primaryProfile: true,
            },
        });

        if (!user || !user.primaryProfile) {
            throw new NotFoundException("사용자를 찾을 수 없습니다.");
        }

        const member = await this.prisma.workspaceMember.create({
            data: { workspaceId, userId, profileId: user.primaryProfile.id },
            include: { user: true, workspace: true, inviter: true },
        });
        return member;
    }

    async delete(workspaceId: number, userId: number): Promise<void> {
        await this.prisma.workspaceMember.delete({
            where: { id: workspaceId, userId },
        });
    }
}