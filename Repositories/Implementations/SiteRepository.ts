import { createPrismaClient } from "@/lib/prisma";
import { ISiteRepository, SiteWithRelations } from "@/Repositories/Interfaces/ISiteRepository";
import { PrismaClient } from "@/src/generated/prisma";
import { D1Database } from "@cloudflare/workers-types";

export class SiteRepository implements ISiteRepository {
    private prisma: PrismaClient;
    constructor(db: D1Database) {
        this.prisma = createPrismaClient(db);
    }

    async add(workspaceId: number, companyId: number, name: string, location: string, startDate: Date, endDate: Date, managementNumber?: string, memo?: string): Promise<SiteWithRelations> {
        // FIXME: 워크스페이스에 해당 하는 회사 아이디인지 확인하고 연결해야함.
        const site = await this.prisma.site.create({
            data: {
                name,
                location,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                managementNumber,
                memo,
                workspace: {
                    connect: {
                        id: workspaceId
                    }
                },
                company: {
                    connect: {
                        id: companyId
                    }
                }
            },
            include: {
                workspace: true,
                company: true,
                siteAttendances: true,
            },
        });

        return site;
    }

    async update(id: number, companyId: number, name: string, location: string, startDate: Date, endDate: Date, managementNumber?: string, memo?: string): Promise<SiteWithRelations> {
        console.log(managementNumber);
        console.log(memo);

        const updatedSite = await this.prisma.site.update({
            where: { id },
            data: {
                name,
                companyId,
                location,
                startDate,
                endDate,
                managementNumber,
                memo,
            },
            include: {
                workspace: true,
                company: true,
                siteAttendances: true,
            },
        });

        return updatedSite;
    }

    async delete(id: number): Promise<void> {
        await this.prisma.site.delete({
            where: { id },
        });
    }

    async getByWorkspaceId(workspaceId: number): Promise<SiteWithRelations[]> {
        const sites = await this.prisma.site.findMany({
            where: { workspaceId },
            include: {
                workspace: true,
                company: true,
                siteAttendances: true,
            },
        });

        return sites;
    }

    async getByCompanyId(companyId: number): Promise<SiteWithRelations[]> {
        const sites = await this.prisma.site.findMany({
            where: { companyId },
            include: {
                workspace: true,
                company: true,
                siteAttendances: true,
            },
        });

        return sites;
    }

    async getById(id: number): Promise<SiteWithRelations | null> {
        const site = await this.prisma.site.findUnique({
            where: { id },
            include: {
                workspace: true,
                company: true,
                siteAttendances: true,
            },
        });

        return site;
    }
}   