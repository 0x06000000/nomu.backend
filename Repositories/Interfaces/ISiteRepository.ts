import { Site } from "@/src/generated/prisma";
import { Company } from "@/src/generated/prisma";
import { Workspace } from "@/src/generated/prisma";
import { SiteAttendance } from "@/src/generated/prisma";

export type SiteWithRelations = Site & {
    company: Company;
    workspace: Workspace;
    siteAttendances: SiteAttendance[];
};

export interface ISiteRepository {
    add(workspaceId: number, companyId: number, name: string, location: string, startDate: Date, endDate: Date, managementNumber?: string, memo?: string): Promise<SiteWithRelations>;
    update(id: number, companyId: number, name: string, location: string, startDate: Date, endDate: Date, managementNumber?: string, memo?: string): Promise<SiteWithRelations>;
    delete(id: number): Promise<void>;
    getByWorkspaceId(workspaceId: number): Promise<SiteWithRelations[]>;
    getByCompanyId(companyId: number): Promise<SiteWithRelations[]>;
    getById(id: number): Promise<SiteWithRelations | null>;
}   