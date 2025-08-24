interface DailyWageCalculationInput {
    dailyWage: number; // 일급
    nonTaxableAmount: number; // 비과세액
}

interface DailyWageCalculationResult {
    dailyWage: number; // 일급
    nonTaxableAmount: number; // 비과세액
    taxableIncome: number; // 과세소득 (일급 - 비과세액)
    laborIncomeDeduction: number; // 근로소득공제 (15만원)
    taxBase: number; // 과세표준 (과세소득 - 근로소득공제)
    taxRate: number; // 세율 (6%)
    calculatedTax: number; // 계산세액 (과세표준 × 세율)
    laborIncomeTaxCredit: number; // 근로소득세액공제 (55%)
    finalTax: number; // 최종세액 (계산세액 × (1 - 근로소득세액공제))
    isSmallAmountWithholding: boolean; // 소액부징수 여부 (1,000원 미만)
}

export function calculateDailyWorkerIncomeTax(input: DailyWageCalculationInput): DailyWageCalculationResult {
    const { dailyWage, nonTaxableAmount } = input;
    
    // 과세소득 = 일급 - 비과세액
    const taxableIncome = Math.max(0, dailyWage - nonTaxableAmount);
    
    // 근로소득공제 = 15만원
    const laborIncomeDeduction = 150000;
    
    // 과세표준 = 과세소득 - 근로소득공제
    const taxBase = Math.max(0, taxableIncome - laborIncomeDeduction);
    
    // 세율 = 6%
    const taxRate = 0.06;
    
    // 계산세액 = 과세표준 × 세율
    const calculatedTax = taxBase * taxRate;
    
    // 근로소득세액공제 = 55%
    const laborIncomeTaxCredit = 0.55;
    
    // 최종세액 = 계산세액 × (1 - 근로소득세액공제)
    const finalTax = calculatedTax * (1 - laborIncomeTaxCredit);
    
    // 소액부징수 여부 판단 (1,000원 미만)
    const isSmallAmountWithholding = finalTax < 1000;
    
    return {
        dailyWage,
        nonTaxableAmount,
        taxableIncome,
        laborIncomeDeduction,
        taxBase,
        taxRate,
        calculatedTax,
        laborIncomeTaxCredit,
        finalTax,
        isSmallAmountWithholding
    };
}