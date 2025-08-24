import { IIndustrialAccidentInsurancePremiumRateRepository } from "@/Repositories/Interfaces/IIndustrialAccidentInsurancePremiumRateRepository";
import { GetSecondLevelsQuery } from "./GetSecondLevelsQuery";

export class GetSecondLevelsQueryHandler {
    constructor(private readonly industrialAccidentInsurancePremiumRateRepository: IIndustrialAccidentInsurancePremiumRateRepository) { }

    async handle(query: GetSecondLevelsQuery): Promise<{
        secondLevel: string;
        secondLevelCode: number;
    }[]> {
        return this.industrialAccidentInsurancePremiumRateRepository.getSecondLevels(query.firstLevelCode);
    }
}