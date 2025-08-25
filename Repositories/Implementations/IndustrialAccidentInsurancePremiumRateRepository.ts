import { IIndustrialAccidentInsurancePremiumRateRepository, IndustrialAccidentInsurancePremiumRateWithRelations } from "../Interfaces/IIndustrialAccidentInsurancePremiumRateRepository";
import { PrismaClient } from "@/src/generated/prisma";
import { createPrismaClient } from "@/lib/prisma";
import { D1Database } from "@cloudflare/workers-types";
import { normalizeWhitespace } from "@/lib/string";

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
        const batchSize = 10;

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

    async getFirstLevels(): Promise<{
        firstLevel: string;
        firstLevelCode: number;
    }[]> {
        const results = await this.prisma.industrialAccidentInsurancePremiumRate.findMany({
            distinct: ['firstLevel', 'firstLevelCode'],
            select: {
                firstLevel: true,
                firstLevelCode: true
            },
            where: {
                firstLevel: { not: null },
                firstLevelCode: { not: null }
            }
        });

        return results.map(result => ({
            firstLevel: normalizeWhitespace(result.firstLevel),
            firstLevelCode: result.firstLevelCode!
        }));
    }

    async getSecondLevels(firstLevelCode: number): Promise<{
        secondLevel: string;
        secondLevelCode: number;
    }[]> {
        const results = await this.prisma.industrialAccidentInsurancePremiumRate.findMany({
            distinct: ['secondLevel', 'secondLevelCode'],
            select: {
                secondLevel: true,
                secondLevelCode: true
            },
            where: {
                secondLevel: { not: null },
                secondLevelCode: { not: null },
                firstLevelCode: firstLevelCode
            }
        });

        return results.map(result => ({
            secondLevel: normalizeWhitespace(result.secondLevel),
            secondLevelCode: result.secondLevelCode!
        }));
    }

    async getIndustries(firstLevelCode: number, secondLevelCode: number): Promise<{
        industryName: string;
        industryCode: number;
    }[]> {
        const results = await this.prisma.industrialAccidentInsurancePremiumRate.findMany({
            distinct: ['industryName', 'industryCode'],
            select: {
                industryName: true,
                industryCode: true
            },
            where: {
                industryName: { not: null },
                industryCode: { not: null },
                firstLevelCode: firstLevelCode,
                secondLevelCode: secondLevelCode
            }
        });

        return results.map(result => ({
            industryName: normalizeWhitespace(result.industryName),
            industryCode: result.industryCode!
        }));
    }
}