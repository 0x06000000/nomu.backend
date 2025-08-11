import { Company, Site, Owner, Employee, CompanyIndustryCode, DayLaborer, Workspace } from "@/src/generated/prisma";
import { FilterOptions } from "@/lib/filter";

export type CompanyWithRelations = Company & {
    workspace: Workspace;
    companyIndustryCodes: CompanyIndustryCode[];
    dayLaborers: DayLaborer[];
    employees: Employee[];
    owners: Owner[];
    sites: Site[];
};

export interface ICompanyRepository {
    add(workspaceId: number, name: string, location: string, employeeCount: number, createdBy: number, businessNumber?: string, managementNumber?: string): Promise<CompanyWithRelations>;
    update(id: number, name: string, location: string, employeeCount: number, businessNumber?: string, managementNumber?: string): Promise<CompanyWithRelations>;
    delete(id: number): Promise<void>;
    getByWorkspaceId(workspaceId: number): Promise<CompanyWithRelations[]>;
    getById(id: number): Promise<CompanyWithRelations | null>;
    get(filter: FilterOptions<Company>): Promise<CompanyWithRelations[]>;
}