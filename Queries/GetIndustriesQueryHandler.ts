import { IIndustrialAccidentInsurancePremiumRateRepository } from "@/Repositories/Interfaces/IIndustrialAccidentInsurancePremiumRateRepository";
import { GetIndustriesQuery } from "./GetIndustriesQuery";

export class GetIndustriesQueryHandler {
    constructor(private readonly industrialAccidentInsurancePremiumRateRepository: IIndustrialAccidentInsurancePremiumRateRepository) { }

    async handle(query: GetIndustriesQuery): Promise<{
        industryName: string;
        industryCode: number;
    }[]> {
        return this.industrialAccidentInsurancePremiumRateRepository.getIndustries(query.firstLevelCode, query.secondLevelCode);
    }
}