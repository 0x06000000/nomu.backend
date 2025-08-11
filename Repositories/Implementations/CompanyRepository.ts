import { ICompanyRepository, CompanyWithRelations } from "@/Repositories/Interfaces/ICompanyRepository";
import { PrismaClient, Company, Prisma } from "@/src/generated/prisma";
import { createPrismaClient } from "@/lib/prisma";
import { D1Database } from "@cloudflare/workers-types";
import { buildPagination, FilterOptions } from "@/lib/filter";

export class CompanyRepository implements ICompanyRepository {
    private prisma: PrismaClient;
    constructor(db: D1Database) {
        this.prisma = createPrismaClient(db);
    }

    async add(workspaceId: number, name: string, location: string, employeeCount: number, createdBy: number, businessNumber?: string, managementNumber?: string): Promise<CompanyWithRelations> {
        const company = await this.prisma.company.create({
            data: {
                name,
                workspaceId,
                location,
                businessNumber,
                managementNumber,
                employeeCount,
                createdBy: createdBy,
            },
            include: {
                workspace: true,
                companyIndustryCodes: true,
                dayLaborers: true,
                employees: true,
                owners: true,
                sites: true,
            }
        });

        return company;
    }

    async update(id: number, name: string, location: string, employeeCount: number, businessNumber?: string, managementNumber?: string): Promise<CompanyWithRelations> {
        const updatedCompany = await this.prisma.company.update({
            where: { id },
            data: { name, location, employeeCount, businessNumber, managementNumber },
            include: {
                workspace: true,
                companyIndustryCodes: true,
                dayLaborers: true,
                employees: true,
                owners: true,
                sites: true,
            }
        });

        return updatedCompany;
    }

    async delete(id: number): Promise<void> {
        await this.prisma.company.delete({
            where: { id }
        });
    }

    async getByWorkspaceId(workspaceId: number): Promise<CompanyWithRelations[]> {
        const companies = await this.prisma.company.findMany({
            where: { workspaceId },
            include: {
                workspace: true,
                companyIndustryCodes: true,
                dayLaborers: true,
                employees: true,
                owners: true,
                sites: true,
            }
        });

        return companies;
    }

    async getById(id: number): Promise<CompanyWithRelations | null> {
        const company = await this.prisma.company.findUnique({
            where: { id },
            include: {
                workspace: true,
                companyIndustryCodes: true,
                dayLaborers: true,
                employees: true,
                owners: true,
                sites: true,
            }
        });

        return company;
    }

    async get(filter: FilterOptions<Company>): Promise<CompanyWithRelations[]> {
        const where: Prisma.CompanyWhereInput = {};

        if (filter.search) {
            console.log(filter.search, 111, filter.fields);
            const searchFields = filter.fields || Object.keys(Prisma.CompanyScalarFieldEnum);

            const searchConditions = searchFields.map(field => {
                let condition = null;

                const parseNumber = (value: string) => {
                    const num = parseInt(value || '');
                    return !isNaN(num) ? num : null;
                };

                const parseDate = (dateStr: string, fieldName: string) => {
                    try {
                        const date = new Date(dateStr);
                        if (!isNaN(date.getTime())) {
                            const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                            const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

                            return {
                                gte: startOfDay,
                                lte: endOfDay
                            };
                        }
                    } catch (e) {
                        console.warn(`날짜 형식 파싱 실패: ${dateStr}, 필드: ${fieldName}`, e);
                    }
                    return null;
                };

                switch (field) {
                    case 'name':
                        condition = {
                            name: {
                                contains: filter.search
                            }
                        };
                        break;
                    case 'location':
                        condition = {
                            location: {
                                contains: filter.search
                            }
                        };
                        break;
                    case 'businessNumber':
                        condition = {
                            businessNumber: {
                                contains: filter.search
                            }
                        };
                        break;
                    case 'managementNumber':
                        condition = {
                            managementNumber: {
                                contains: filter.search
                            }
                        };
                        break;
                    case 'id': {
                        const value = parseNumber(filter.search || '');
                        if (value !== null) {
                            condition = { id: value };
                        }
                        break;
                    }
                    case 'workspaceId': {
                        const value = parseNumber(filter.search || '');
                        if (value !== null) {
                            condition = { workspaceId: value };
                        }
                        break;
                    }
                    case 'employeeCount': {
                        const value = parseNumber(filter.search || '');
                        if (value !== null) {
                            condition = { employeeCount: value };
                        }
                        break;
                    }
                    case 'createdAt': {
                        const dateRange = parseDate(filter.search || '', 'createdAt');
                        if (dateRange) {
                            condition = { createdAt: dateRange };
                        }
                        break;
                    }
                    case 'updatedAt': {
                        const dateRange = parseDate(filter.search || '', 'updatedAt');
                        if (dateRange) {
                            condition = { updatedAt: dateRange };
                        }
                        break;
                    }
                }

                return condition;
            }).filter(condition => condition !== null);

            if (searchConditions.length > 0) {
                where.OR = searchConditions;
            }
        }

        const pagination = buildPagination(filter);

        const companies = await this.prisma.company.findMany({
            where,
            ...pagination,
            include: {
                workspace: true,
                companyIndustryCodes: true,
                dayLaborers: true,
                employees: true,
                owners: true,
                sites: true,
            }
        });

        return companies;
    }
}