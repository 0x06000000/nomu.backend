import { UpsertIndustrialAccidentInsurancePremiumRateCommand } from "./UpsertIndustrialAccidentInsurancePremiumRateCommand";
import { IIndustrialAccidentInsurancePremiumRateRepository } from "@/Repositories/Interfaces/IIndustrialAccidentInsurancePremiumRateRepository";
import { IndustrialAccidentInsurancePremiumRateService } from "@/Services/IndustrialAccidentInsurancePremiumRateService";

export class UpsertIndustrialAccidentInsurancePremiumRateCommandHandler {
    constructor(private readonly industrialAccidentInsurancePremiumRateRepository: IIndustrialAccidentInsurancePremiumRateRepository, private readonly industrialAccidentInsurancePremiumRateService: IndustrialAccidentInsurancePremiumRateService) { }

    async handle(command: UpsertIndustrialAccidentInsurancePremiumRateCommand) {
        const industryRates = await this.industrialAccidentInsurancePremiumRateService.searchIndustryRates(command.pageNumber, command.pageSize);

        const items = industryRates.body.items.item;
        const industrialAccidentInsurancePremiumRates = items.map(item => ({
            firstLevel: item.eopjongLevel1?._text,
            firstLevelCode: item.eopjongLevel1Cd?._text ? parseInt(item.eopjongLevel1Cd?._text) : undefined,
            secondLevel: item.eopjongLevel2?._text,
            secondLevelCode: item.eopjongLevel2Cd?._text ? parseInt(item.eopjongLevel2Cd?._text) : undefined,
            industryName: item.sjEopjongNm1?._text,
            industryCode: item.sjEopjongCd?._text ? parseInt(item.sjEopjongCd?._text) : undefined,
            date: item.jyFromDt?._text,
            rate: item.jyYoyul?._text ? parseFloat(item.jyYoyul?._text) : undefined,
        }));

        await this.industrialAccidentInsurancePremiumRateRepository.upsertMany(industrialAccidentInsurancePremiumRates);
        return items;
    }
}   