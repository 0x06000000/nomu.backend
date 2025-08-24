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
        for (const rate of industrialAccidentInsurancePremiumRates) {
            // 기존 레코드 찾기
            const existingRecord = await this.prisma.industrialAccidentInsurancePremiumRate.findFirst({
                where: {
                    firstLevel: rate.firstLevel,
                    firstLevelCode: rate.firstLevelCode,
                    secondLevel: rate.secondLevel,
                    secondLevelCode: rate.secondLevelCode,
                    industryName: rate.industryName,
                    industryCode: rate.industryCode,
                    date: rate.date
                }
            });

            if (existingRecord) {
                // 기존 레코드가 있으면 업데이트
                await this.prisma.industrialAccidentInsurancePremiumRate.update({
                    where: {
                        id: existingRecord.id
                    },
                    data: {
                        rate: rate.rate
                    }
                });
            } else {
                // 없으면 새로 생성
                await this.prisma.industrialAccidentInsurancePremiumRate.create({
                    data: {
                        firstLevel: rate.firstLevel,
                        firstLevelCode: rate.firstLevelCode,
                        secondLevel: rate.secondLevel,
                        secondLevelCode: rate.secondLevelCode,
                        industryName: rate.industryName,
                        industryCode: rate.industryCode,
                        date: rate.date,
                        rate: rate.rate
                    }
                });
            }
        }
    }
}