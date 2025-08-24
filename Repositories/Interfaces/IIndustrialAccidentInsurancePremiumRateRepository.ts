import { UpsertIndustrialAccidentInsurancePremiumRateCommand } from "@/Commands/UpsertIndustrialAccidentInsurancePremiumRateCommand";
import { IndustrialAccidentInsurancePremiumRate } from "@/src/generated/prisma";

export type IndustrialAccidentInsurancePremiumRateWithRelations = IndustrialAccidentInsurancePremiumRate;

export interface IIndustrialAccidentInsurancePremiumRateRepository {
    upsertMany(industrialAccidentInsurancePremiumRates: {
        firstLevel?: string;
        firstLevelCode?: number;
        secondLevel?: string;
        secondLevelCode?: number;
        industryName?: string;
        industryCode?: number;
        date?: string;
        rate?: number;
    }[]): Promise<void>;
    getFirstLevels(): Promise<{
        firstLevel: string;
        firstLevelCode: number;
    }[]>;
    getSecondLevels(firstLevelCode: number): Promise<{
        secondLevel: string;
        secondLevelCode: number;
    }[]>;
    getIndustries(firstLevelCode: number, secondLevelCode: number): Promise<{
        industryName: string;
        industryCode: number;
    }[]>;
}