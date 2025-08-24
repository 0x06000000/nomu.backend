import { Env } from "@/common/Env";
import { IndustrialAccidentInsurancePremiumRateService } from "@/Services/IndustrialAccidentInsurancePremiumRateService";
import { CreateIndustrialAccidentInsurancePremiumRateCommandHandler } from "@/Commands/CreateIndustrialAccidentInsurancePremiumRateCommandHandler";
import { CreateIndustrialAccidentInsurancePremiumRateCommand } from "@/Commands/CreateIndustrialAccidentInsurancePremiumRateCommand";
import { IndustrialAccidentInsurancePremiumRateRepository } from "@/Repositories/Implementations/IndustrialAccidentInsurancePremiumRateRepository";

export class IndustrialAccidentInsurancePremiumRateController {
  static async createIndustrialAccidentInsurancePremiumRate(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pageNo = url.searchParams.get('pageNo') || 1;
    const numOfRows = url.searchParams.get('numOfRows') || 10;

    const industrialAccidentInsurancePremiumRateRepository = new IndustrialAccidentInsurancePremiumRateRepository(env.DB);
    const industrialAccidentInsurancePremiumRateService = new IndustrialAccidentInsurancePremiumRateService({
      apiKey: env.SERVICE_KEY,
      apiUrl: env.INDUSTRIAL_ACCIDENT_INSURANCE_PREMIUM_RATE_API_URL
    });

    const command = new CreateIndustrialAccidentInsurancePremiumRateCommand(Number(pageNo), Number(numOfRows));
    const handler = new CreateIndustrialAccidentInsurancePremiumRateCommandHandler(industrialAccidentInsurancePremiumRateRepository, industrialAccidentInsurancePremiumRateService);
    const result = await handler.handle(command);
    
    return new Response(JSON.stringify(result), { status: 200 });
  }
}
