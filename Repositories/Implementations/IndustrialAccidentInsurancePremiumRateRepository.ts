import { IIndustrialAccidentInsurancePremiumRateRepository, IndustrialAccidentInsurancePremiumRateWithRelations } from "../Interfaces/IIndustrialAccidentInsurancePremiumRateRepository";
import { PrismaClient } from "@/src/generated/prisma";
import { createPrismaClient } from "@/lib/prisma";
import { D1Database } from "@cloudflare/workers-types";

export class IndustrialAccidentInsurancePremiumRateRepository implements IIndustrialAccidentInsurancePremiumRateRepository {
    private prisma: PrismaClient;

    constructor(db: D1Database) {
        this.prisma = createPrismaClient(db);
    }

    async createMany(industrialAccidentInsurancePremiumRates: {
        firstLevel: string;
        firstLevelCode: number;
        secondLevel: string;
        secondLevelCode: number;
        industryName: string;
        industryCode: number;
        date: string;
        rate: number;
    }[]): Promise<void> {
        await this.prisma.industrialAccidentInsurancePremiumRate.createMany({
            data: industrialAccidentInsurancePremiumRates,
        });
    }
}