import { CompanyWithRelations } from "@/Repositories/Interfaces/ICompanyRepository";

class CompanyResponse {
    public readonly id: number;
    public readonly workspaceId: number;
    public readonly name: string;
    public readonly location: string;
    public readonly employeeCount: number;
    public readonly createdBy: number;
    public readonly businessNumber: string | null;
    public readonly managementNumber: string | null;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(company: CompanyWithRelations) {
        this.id = company.id;
        this.workspaceId = company.workspaceId;
        this.name = company.name;
        this.location = company.location;
        this.employeeCount = company.employeeCount;
        this.createdBy = company.createdBy;
        this.businessNumber = company.businessNumber;
        this.managementNumber = company.managementNumber;
        this.createdAt = company.createdAt;
        this.updatedAt = company.updatedAt;
    }
}

export class GetCompaniesResponse {
    public readonly companies: CompanyResponse[];

    constructor(companies: CompanyWithRelations[]) {
        this.companies = companies.map(company => new CompanyResponse(company));
    }
}