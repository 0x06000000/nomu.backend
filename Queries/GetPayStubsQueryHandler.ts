import { GetPayStubsQuery } from "@/Queries/GetPayStubsQuery";
import { GetPayStubsResponse, PayStubResponse } from "@/DTOs/GetPayStubsResponse";
import { ISiteAttendanceRepository } from "@/Repositories/Interfaces/ISiteAttendanceRepository";
import { calculateDailyWorkerIncomeTax } from "@/lib/dailyWorkerIncomeTaxCalculator";
import { calculateInsuranceFee } from "@/lib/insuranceFeeCalculator";

export class GetPayStubsQueryHandler {
    constructor(private readonly siteAttendanceRepository: ISiteAttendanceRepository) {
    }

    async handle(query: GetPayStubsQuery): Promise<GetPayStubsResponse> {
        // 해당 연월의 출근기록 조회
        const siteAttendances = query.siteId
            ? await this.siteAttendanceRepository.getByYearMonthAndSiteId(query.year, query.month, query.siteId)
            : await this.siteAttendanceRepository.getByYearMonth(query.year, query.month);

        // 근로자별로 그룹화
        const workerAttendances = new Map<number, typeof siteAttendances>();
        siteAttendances.forEach(attendance => {
            const workerId = attendance.talentPool.id;
            if (!workerAttendances.has(workerId)) {
                workerAttendances.set(workerId, []);
            }
            workerAttendances.get(workerId)?.push(attendance);
        });

        const payStubs = Array.from(workerAttendances.entries()).map(([workerId, attendances]) => {
            const talentPool = attendances[0].talentPool;

            // 근무 시간 계산
            let totalHours = 0;
            attendances.forEach(att => {
                const startTime = new Date(att.startTime);
                const endTime = new Date(att.endTime);
                const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
                totalHours += hours;
            });

            // 총 급여 계산
            const totalAmount = attendances.reduce((sum, att) => sum + att.amount, 0);

            // 일용직 소득세 계산
            let totalIncomeTax = 0;
            let totalLocalIncomeTax = 0;

            attendances.forEach(att => {
                const dailyWage = att.amount;
                if (dailyWage > 0) {
                    const taxResult = calculateDailyWorkerIncomeTax({ dailyWage: dailyWage, nonTaxableAmount: 0 });

                    if (!taxResult.isSmallAmountWithholding) {
                        totalIncomeTax += taxResult.finalTax;
                        totalLocalIncomeTax += taxResult.finalTax * 0.1;
                    }
                }
            });

            // 4대보험료 계산
            const insuranceResult = calculateInsuranceFee({
                income: totalAmount,
                taxfree: 0,
                empType: 'lt150' // 일용직은 150명 미만 기준
            });

            // 순수령액 계산
            const totalDeductions = insuranceResult?.workerSum || 0 + totalIncomeTax + totalLocalIncomeTax;
            const netSalary = totalAmount - totalDeductions;

            console.log(talentPool);

            return new PayStubResponse(
                talentPool,
                attendances.length, // 근무일수
                totalHours,
                totalAmount,
                insuranceResult?.rows.find(r => r.name === '국민연금')?.worker || 0,
                insuranceResult?.rows.find(r => r.name === '건강보험')?.worker || 0,
                insuranceResult?.rows.find(r => r.name === '장기요양보험')?.worker || 0,
                insuranceResult?.rows.find(r => r.name === '고용보험-실업급여')?.worker || 0,
                totalIncomeTax,
                totalLocalIncomeTax,
                netSalary
            );
        });

        return new GetPayStubsResponse(payStubs);
    }
}