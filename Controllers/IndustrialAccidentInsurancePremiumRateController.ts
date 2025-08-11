import { Env } from "@/common/Env";
import { IndustrialAccidentInsurancePremiumRateService } from "@/Services/IndustrialAccidentInsurancePremiumRateService";

export class IndustrialAccidentInsurancePremiumRateController {
  static async searchIndustryRates(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pageNo = url.searchParams.get('pageNo') || 1;
    const numOfRows = url.searchParams.get('numOfRows') || 10;
    const service = new IndustrialAccidentInsurancePremiumRateService({
        apiKey: env.SERVICE_KEY,
        apiUrl: env.INDUSTRIAL_ACCIDENT_INSURANCE_PREMIUM_RATE_API_URL
    });
    const result = await service.searchIndustryRates(Number(pageNo), Number(numOfRows));
    return new Response(JSON.stringify(result), { status: 200 });
  }
}
