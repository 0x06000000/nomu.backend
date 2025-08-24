import { IndustrialAccidentInsurancePremiumRate } from "@/src/generated/prisma";

export class CreateIndustrialAccidentInsurancePremiumRateResponse {
    id: number;
    firstLevel: string | null;
    firstLevelCode: number | null;
    secondLevel: string | null;
    secondLevelCode: number | null;
    industryName: string | null;
    industryCode: number | null;
    date: string | null;
    rate: number | null;

    constructor(industrialAccidentInsurancePremiumRate: IndustrialAccidentInsurancePremiumRate) {
        this.id = industrialAccidentInsurancePremiumRate.id;
        this.firstLevel = industrialAccidentInsurancePremiumRate.firstLevel;
        this.firstLevelCode = industrialAccidentInsurancePremiumRate.firstLevelCode;
        this.secondLevel = industrialAccidentInsurancePremiumRate.secondLevel;
        this.secondLevelCode = industrialAccidentInsurancePremiumRate.secondLevelCode;
        this.industryName = industrialAccidentInsurancePremiumRate.industryName;
        this.industryCode = industrialAccidentInsurancePremiumRate.industryCode;
        this.date = industrialAccidentInsurancePremiumRate.date;
        this.rate = industrialAccidentInsurancePremiumRate.rate;
    }
}