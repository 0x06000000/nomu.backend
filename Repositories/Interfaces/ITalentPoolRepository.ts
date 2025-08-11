import { TalentPool, DayLaborer, Employee, Workspace, SiteAttendance, Profile } from "@/src/generated/prisma";

export type TalentPoolWithRelations = TalentPool & {
    workspace: Workspace;
    profile: Profile | null;
    dayLaborers: DayLaborer[];
    employees: Employee[];
    siteAttendances: SiteAttendance[];
};

export interface ITalentPoolRepository {
    add(workspaceId: number, name: string, birthday: Date, phone: string, address: string, memo?: string): Promise<TalentPoolWithRelations>;
    update(id: number, name: string, birthday: Date, phone: string, address: string, memo?: string): Promise<TalentPoolWithRelations>;
    delete(id: number): Promise<void>;
    getByWorkspaceId(workspaceId: number): Promise<TalentPoolWithRelations[]>;
    getByProfileId(profileId: number): Promise<TalentPoolWithRelations[]>;
    getByDayLaborerId(dayLaborerId: number): Promise<TalentPoolWithRelations | null>;
    getByEmployeeId(employeeId: number): Promise<TalentPoolWithRelations | null>;
    getById(id: number): Promise<TalentPoolWithRelations | null>;
}   