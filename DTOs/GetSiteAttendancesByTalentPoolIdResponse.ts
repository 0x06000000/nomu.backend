import { SiteAttendanceWithRelations } from "@/Repositories/Interfaces/ISiteAttendanceRepository";

class SiteAttendanceResponse {
    public readonly id: number;
    public readonly siteId: number;
    public readonly date: Date;
    public readonly startTime: Date;
    public readonly endTime: Date;
    public readonly amount: number;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(siteAttendance: SiteAttendanceWithRelations) {
        this.id = siteAttendance.id;
        this.siteId = siteAttendance.siteId;
        this.date = siteAttendance.date;
        this.startTime = siteAttendance.startTime;
        this.endTime = siteAttendance.endTime;
        this.amount = siteAttendance.amount;
        this.createdAt = siteAttendance.createdAt;
        this.updatedAt = siteAttendance.updatedAt;
    }
}

export class GetSiteAttendancesByTalentPoolIdResponse {
    public readonly siteAttendances: SiteAttendanceResponse[];

    constructor(siteAttendances: SiteAttendanceWithRelations[]) {
        this.siteAttendances = siteAttendances.map(siteAttendance => new SiteAttendanceResponse(siteAttendance));
    }
}