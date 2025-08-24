import { CreateIndustrialAccidentInsurancePremiumRateCommand } from "@/Commands/CreateIndustrialAccidentInsurancePremiumRateCommand";
import { IndustrialAccidentInsurancePremiumRate } from "@/src/generated/prisma";

export type IndustrialAccidentInsurancePremiumRateWithRelations = IndustrialAccidentInsurancePremiumRate;

export interface IIndustrialAccidentInsurancePremiumRateRepository {
    createMany(industrialAccidentInsurancePremiumRates: {
        firstLevel: string;
        firstLevelCode: number;
        secondLevel: string;
        secondLevelCode: number;
        industryName: string;
        industryCode: number;
        date: string;
        rate: number;
    }[]): Promise<void>;
}