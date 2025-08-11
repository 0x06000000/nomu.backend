import { ITalentPoolRepository, TalentPoolWithRelations } from "@/Repositories/Interfaces/ITalentPoolRepository";
import { PrismaClient, TalentPool } from "@/src/generated/prisma";
import { D1Database } from "@cloudflare/workers-types";

import { createPrismaClient } from "@/lib/prisma";

export class TalentPoolRepository implements ITalentPoolRepository {
    private prisma: PrismaClient;
    constructor(db: D1Database) {
        this.prisma = createPrismaClient(db);
    }

    async add(workspaceId: number, name: string, birthday: Date, phone: string, address: string, memo?: string): Promise<TalentPoolWithRelations> {
        const talentPool = await this.prisma.talentPool.create({
            data: {
                workspaceId,
                name,
                birthday,
                phone,
                address,
                memo,
            },
            include: {
                workspace: true,
                profile: true,
                dayLaborers: true,
                employees: true,
                siteAttendances: true,
            },
        });

        return talentPool;
    }

    async update(id: number, name: string, birthday: Date, phone: string, address: string, memo?: string): Promise<TalentPoolWithRelations> {
        const updatedTalentPool = await this.prisma.talentPool.update({
            where: { id },
            data: { name, birthday, phone, address, memo },
            include: {
                workspace: true,
                profile: true,
                dayLaborers: true,
                employees: true,
                siteAttendances: true,
            },
        });

        return updatedTalentPool;
    }

    async delete(id: number): Promise<void> {
        await this.prisma.talentPool.delete({
            where: { id },
        });
    }

    async getByWorkspaceId(workspaceId: number): Promise<TalentPoolWithRelations[]> {
        const talentPools = await this.prisma.talentPool.findMany({
            where: { workspaceId },
            include: {
                workspace: true,
                profile: true,
                dayLaborers: true,
                employees: true,
                siteAttendances: true,
            },
        });

        return talentPools;
    }

    async getByProfileId(profileId: number): Promise<TalentPoolWithRelations[]> {
        const talentPools = await this.prisma.talentPool.findMany({
            where: { profileId },
            include: {
                workspace: true,
                profile: true,
                dayLaborers: true,
                employees: true,
                siteAttendances: true,
            },
        });

        return talentPools;
    }

    async getByDayLaborerId(dayLaborerId: number): Promise<TalentPoolWithRelations | null> {
        const talentPool = await this.prisma.talentPool.findFirst({
            where: {
                dayLaborers: {
                    some: {
                        id: dayLaborerId,
                    },
                },
            },
            include: {
                workspace: true,
                profile: true,
                dayLaborers: true,
                employees: true,
                siteAttendances: true,
            },
        });

        return talentPool;
    }

    async getByEmployeeId(employeeId: number): Promise<TalentPoolWithRelations | null> {
        const talentPool = await this.prisma.talentPool.findFirst({
            where: {
                employees: {
                    some: {
                        id: employeeId,
                    },
                },
            },
            include: {
                workspace: true,
                profile: true,
                dayLaborers: true,
                employees: true,
                siteAttendances: true,
            },
        });

        return talentPool;
    }

    async getById(id: number): Promise<TalentPoolWithRelations | null> {
        const talentPool = await this.prisma.talentPool.findUnique({
            where: { id },
            include: {
                workspace: true,
                profile: true,
                dayLaborers: true,
                employees: true,
                siteAttendances: true,
            },
        });

        return talentPool;
    }
}   