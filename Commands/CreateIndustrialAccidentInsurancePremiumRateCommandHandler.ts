import { CreateIndustrialAccidentInsurancePremiumRateCommand } from "./CreateIndustrialAccidentInsurancePremiumRateCommand";
import { IIndustrialAccidentInsurancePremiumRateRepository } from "@/Repositories/Interfaces/IIndustrialAccidentInsurancePremiumRateRepository";
import { IndustrialAccidentInsurancePremiumRateService } from "@/Services/IndustrialAccidentInsurancePremiumRateService";

export class CreateIndustrialAccidentInsurancePremiumRateCommandHandler {
    constructor(private readonly industrialAccidentInsurancePremiumRateRepository: IIndustrialAccidentInsurancePremiumRateRepository, private readonly industrialAccidentInsurancePremiumRateService: IndustrialAccidentInsurancePremiumRateService) { }

    async handle(command: CreateIndustrialAccidentInsurancePremiumRateCommand) {
        const industryRates = await this.industrialAccidentInsurancePremiumRateService.searchIndustryRates(command.pageNumber, command.pageSize);

        const items = industryRates.body.items.item;
        const industrialAccidentInsurancePremiumRates = items.map(item => ({
            firstLevel: item.eopjongLevel1._text,
            firstLevelCode: parseInt(item.eopjongLevel1Cd._text),
            secondLevel: item.eopjongLevel2._text,
            secondLevelCode: parseInt(item.eopjongLevel2Cd._text),
            industryName: item.sjEopjongNm1._text,
            industryCode: parseInt(item.sjEopjongCd._text),
            date: item.jyFromDt._text,
            rate: parseFloat(item.jyYoyul._text),
        }));

        await this.industrialAccidentInsurancePremiumRateRepository.upsertMany(industrialAccidentInsurancePremiumRates);
        return items;
    }
}   