import { SiteWithRelations } from "@/Repositories/Interfaces/ISiteRepository";

export class UpdateSiteResponse {
    public readonly id: number;
    public readonly workspaceId: number;
    public readonly companyId: number;
    public readonly name: string;
    public readonly location: string;
    public readonly startDate: Date;
    public readonly endDate: Date;
    public readonly managementNumber: string | null;
    public readonly memo: string | null;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(site: SiteWithRelations) {
        this.id = site.id;
        this.workspaceId = site.workspaceId;
        this.companyId = site.companyId;
        this.name = site.name;
        this.location = site.location;
        this.startDate = site.startDate;
        this.endDate = site.endDate;
        this.managementNumber = site.managementNumber;
        this.memo = site.memo;
        this.createdAt = site.createdAt;
        this.updatedAt = site.updatedAt;
    }
}