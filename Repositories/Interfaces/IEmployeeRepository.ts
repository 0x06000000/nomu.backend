import { Employee } from "@/src/generated/prisma";
import { Company } from "@/src/generated/prisma";
import { TalentPool } from "@/src/generated/prisma";

export type EmployeeWithRelations = Employee & {
    company: Company;
    talentPool: TalentPool;
};

export interface IEmployeeRepository {
}   