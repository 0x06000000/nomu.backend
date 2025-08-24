import { Env } from "@/common/Env";
import { IndustrialAccidentInsurancePremiumRateService } from "@/Services/IndustrialAccidentInsurancePremiumRateService";
import { UpsertIndustrialAccidentInsurancePremiumRateCommandHandler } from "@/Commands/UpsertIndustrialAccidentInsurancePremiumRateCommandHandler";
import { UpsertIndustrialAccidentInsurancePremiumRateCommand } from "@/Commands/UpsertIndustrialAccidentInsurancePremiumRateCommand";
import { IndustrialAccidentInsurancePremiumRateRepository } from "@/Repositories/Implementations/IndustrialAccidentInsurancePremiumRateRepository";
import { GetFirstLevelsQuery } from "@/Queries/GetFirstLevelsQuery";
import { GetFirstLevelsQueryHandler } from "@/Queries/GetFirstLevelsQueryHandler";
import { GetSecondLevelsQuery } from "@/Queries/GetSecondLevelsQuery";
import { GetSecondLevelsQueryHandler } from "@/Queries/GetSecondLevelsQueryHandler";
import { GetIndustriesQuery } from "@/Queries/GetIndustriesQuery";
import { GetIndustriesQueryHandler } from "@/Queries/GetIndustriesQueryHandler";
import { Factory } from "@/lib/factory";

export class IndustrialAccidentInsurancePremiumRateController {
  static async upsertIndustrialAccidentInsurancePremiumRate(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pageNo = url.searchParams.get('pageNo') || 1;
    const numOfRows = url.searchParams.get('numOfRows') || 10;

    const industrialAccidentInsurancePremiumRateService = new IndustrialAccidentInsurancePremiumRateService({
      apiKey: env.SERVICE_KEY,
      apiUrl: env.INDUSTRIAL_ACCIDENT_INSURANCE_PREMIUM_RATE_API_URL
    });

    const command = new UpsertIndustrialAccidentInsurancePremiumRateCommand(Number(pageNo), Number(numOfRows));
    const handler = new UpsertIndustrialAccidentInsurancePremiumRateCommandHandler(Factory.createIndustrialAccidentInsurancePremiumRateRepository(env), industrialAccidentInsurancePremiumRateService);
    const result = await handler.handle(command);

    return new Response(JSON.stringify(result), { status: 200 });
  }

  static async getFirstLevels(request: Request, env: Env): Promise<Response> {
    const query = new GetFirstLevelsQuery();
    const handler = new GetFirstLevelsQueryHandler(Factory.createIndustrialAccidentInsurancePremiumRateRepository(env));
    const result = await handler.handle(query);
    return new Response(JSON.stringify(result), { status: 200 });
  }

  static async getSecondLevels(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const firstLevelCode = url.searchParams.get('firstLevelCode') ? parseInt(url.searchParams.get('firstLevelCode')!) : undefined;
    const query = new GetSecondLevelsQuery(firstLevelCode!);
    const handler = new GetSecondLevelsQueryHandler(Factory.createIndustrialAccidentInsurancePremiumRateRepository(env));
    const result = await handler.handle(query);
    return new Response(JSON.stringify(result), { status: 200 });
  }

  static async getIndustries(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const firstLevelCode = url.searchParams.get('firstLevelCode') ? parseInt(url.searchParams.get('firstLevelCode')!) : undefined;
    const secondLevelCode = url.searchParams.get('secondLevelCode') ? parseInt(url.searchParams.get('secondLevelCode')!) : undefined;
    const query = new GetIndustriesQuery(firstLevelCode!, secondLevelCode!);
    const handler = new GetIndustriesQueryHandler(Factory.createIndustrialAccidentInsurancePremiumRateRepository(env));
    const result = await handler.handle(query);
    return new Response(JSON.stringify(result), { status: 200 });
  }
}
