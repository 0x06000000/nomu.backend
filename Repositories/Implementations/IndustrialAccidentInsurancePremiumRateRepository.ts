import { IIndustrialAccidentInsurancePremiumRateRepository, IndustrialAccidentInsurancePremiumRateWithRelations } from "../Interfaces/IIndustrialAccidentInsurancePremiumRateRepository";
import { PrismaClient } from "@/src/generated/prisma";
import { createPrismaClient } from "@/lib/prisma";
import { D1Database } from "@cloudflare/workers-types";

export class IndustrialAccidentInsurancePremiumRateRepository implements IIndustrialAccidentInsurancePremiumRateRepository {
    private prisma: PrismaClient;

    constructor(db: D1Database) {
        this.prisma = createPrismaClient(db);
    }

    async upsertMany(industrialAccidentInsurancePremiumRates: {
        firstLevel: string;
        firstLevelCode: number;
        secondLevel: string;
        secondLevelCode: number;
        industryName: string;
        industryCode: number;
        date: string;
        rate: number;
    }[]): Promise<void> {
        const batchSize = 25;

        for (let i = 0; i < industrialAccidentInsurancePremiumRates.length; i += batchSize) {
            const batch = industrialAccidentInsurancePremiumRates.slice(i, i + batchSize);

            // Raw SQL로 한 번에 upsert
            const upsertSQL = `
                INSERT INTO IndustrialAccidentInsurancePremiumRate 
                (firstLevel, firstLevelCode, secondLevel, secondLevelCode, industryName, industryCode, date, rate, createdAt, updatedAt)
                VALUES ${batch.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, datetime(), datetime())').join(', ')}
                ON CONFLICT(firstLevel, firstLevelCode, secondLevel, secondLevelCode, industryName, industryCode, date)
                DO UPDATE SET 
                    rate = EXCLUDED.rate,
                    updatedAt = datetime()
            `;

            const values = batch.flatMap(rate => [
                rate.firstLevel,
                rate.firstLevelCode,
                rate.secondLevel,
                rate.secondLevelCode,
                rate.industryName,
                rate.industryCode,
                rate.date,
                rate.rate
            ]);

            await this.prisma.$executeRawUnsafe(upsertSQL, ...values);
        }
    }
}