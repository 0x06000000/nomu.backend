import { DayLaborer, TalentPool } from "@/src/generated/prisma";
import { Company } from "@/src/generated/prisma";

export type DayLaborerWithRelations = DayLaborer & {
    company: Company;
    talentPool: TalentPool;
};

export interface IDayLaborerRepository {
}