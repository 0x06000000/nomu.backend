import { SiteWithRelations } from "@/Repositories/Interfaces/ISiteRepository";

class SiteResponse {
    public readonly id: number;
    public readonly name: string;
    public readonly location: string;
    public readonly startDate: Date;
    public readonly endDate: Date;
    public readonly memo: string | null;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(site: SiteWithRelations) {
        this.id = site.id;
        this.name = site.name;
        this.location = site.location;
        this.startDate = site.startDate;
        this.endDate = site.endDate;
        this.memo = site.memo;
        this.createdAt = site.createdAt;
        this.updatedAt = site.updatedAt;
    }
}

export class GetSitesResponse {
    public readonly sites: SiteResponse[];

    constructor(sites: SiteWithRelations[]) {
        this.sites = sites.map(site => new SiteResponse(site));
    }
}