import { Site, SiteAttendance, TalentPool } from "@/src/generated/prisma";

export type SiteAttendanceWithRelations = SiteAttendance & {
    site: Site;
    talentPool: TalentPool;
};

export interface ISiteAttendanceRepository {
    addMany(talentPoolId: number, siteAttendances: { siteId: number, date: Date, startTime: Date, endTime: Date, amount: number }[]): Promise<SiteAttendanceWithRelations[]>;
    processBatch(talentPoolId: number, operations: {
        upsert?: { id?: number, siteId: number, date: Date, startTime: Date, endTime: Date, amount: number }[],
        delete?: number[]
    }): Promise<SiteAttendanceWithRelations[]>;
    add(siteId: number, talentPoolId: number, date: Date, startTime: Date, endTime: Date, amount: number): Promise<SiteAttendanceWithRelations>;
    update(id: number, siteId: number, date: Date, startTime: Date, endTime: Date, amount: number): Promise<SiteAttendanceWithRelations>;
    delete(id: number): Promise<void>;
    getByTalentPoolId(talentPoolId: number): Promise<SiteAttendanceWithRelations[]>;
    getByDayLaborerId(dayLaborerId: number): Promise<SiteAttendanceWithRelations[]>;
    getByEmployeeId(employeeId: number): Promise<SiteAttendanceWithRelations[]>;
    getBySiteId(siteId: number): Promise<SiteAttendanceWithRelations[]>;
    getById(id: number): Promise<SiteAttendanceWithRelations | null>;
    getByYearMonth(year: number, month: number): Promise<SiteAttendanceWithRelations[]>;
    getByYearMonthAndSiteId(year: number, month: number, siteId: number): Promise<SiteAttendanceWithRelations[]>;
}