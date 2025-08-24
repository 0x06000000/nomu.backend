import { CreateIndustrialAccidentInsurancePremiumRateCommand } from "./CreateIndustrialAccidentInsurancePremiumRateCommand";
import { IIndustrialAccidentInsurancePremiumRateRepository } from "@/Repositories/Interfaces/IIndustrialAccidentInsurancePremiumRateRepository";
import { IndustrialAccidentInsurancePremiumRateService } from "@/Services/IndustrialAccidentInsurancePremiumRateService";

export class CreateIndustrialAccidentInsurancePremiumRateCommandHandler {
    constructor(private readonly industrialAccidentInsurancePremiumRateRepository: IIndustrialAccidentInsurancePremiumRateRepository, private readonly industrialAccidentInsurancePremiumRateService: IndustrialAccidentInsurancePremiumRateService) { }

    async handle(command: CreateIndustrialAccidentInsurancePremiumRateCommand) {
        const industryRates = await this.industrialAccidentInsurancePremiumRateService.searchIndustryRates(command.pageNumber, command.pageSize);

        const items = industryRates.body.items.item;
        const industrialAccidentInsurancePremiumRates = items.map(item => ({
            firstLevel: item.eopjongLevel1,
            firstLevelCode: parseInt(item.eopjongLevel1Cd),
            secondLevel: item.eopjongLevel2,
            secondLevelCode: parseInt(item.eopjongLevel2Cd),
            industryName: item.sjEopjongNm1,
            industryCode: parseInt(item.sjEopjongCd),
            date: item.jyFromDt,
            rate: parseFloat(item.jyYoyul),
        }));

        await this.industrialAccidentInsurancePremiumRateRepository.upsertMany(industrialAccidentInsurancePremiumRates);
        return items;
    }
}   