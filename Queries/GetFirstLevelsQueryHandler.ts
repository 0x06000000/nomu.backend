import { IIndustrialAccidentInsurancePremiumRateRepository } from "@/Repositories/Interfaces/IIndustrialAccidentInsurancePremiumRateRepository";
import { GetFirstLevelsQuery } from "./GetFirstLevelsQuery";

export class GetFirstLevelsQueryHandler {
    constructor(private readonly industrialAccidentInsurancePremiumRateRepository: IIndustrialAccidentInsurancePremiumRateRepository) { }

    async handle(query: GetFirstLevelsQuery): Promise<{
        firstLevel: string;
        firstLevelCode: number;
    }[]> {
        return this.industrialAccidentInsurancePremiumRateRepository.getFirstLevels();
    }
}