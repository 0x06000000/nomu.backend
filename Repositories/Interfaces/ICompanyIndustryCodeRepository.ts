import { CompanyIndustryCode, Company } from "@/src/generated/prisma";

export type CompanyIndustryCodeWithRelations = CompanyIndustryCode & {
    company: Company;
};

export interface ICompanyIndustryCodeRepository {
}   