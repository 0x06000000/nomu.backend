export interface InsuranceFeeResult {
    rows: Array<{
        name: string;
        total: number;
        worker: number;
        employer: number;
        rate: string;
        formula: string;
    }>;
    totalSum: number;
    workerSum: number;
    employerSum: number;
}

export interface InsuranceFeeInput {
    income: number;
    taxfree: number;
    businessCategory?: string;
    empType: 'lt150' | 'gte150' | 'btw150_999' | 'gte1000';
}

// 국민연금 계산
export function calculateNationalPension(income: number, taxfree: number = 0) {
    let base = income - taxfree;
    if (base < 0) base = 0;

    // 국민연금 기준액 계산
    let pensionBase = Math.floor(base / 1000) * 1000;
    if (pensionBase > 6370000) pensionBase = 6370000;
    if (pensionBase < 400000) pensionBase = 400000;

    // 국민연금 보험료 계산
    let pensionWorker = Math.floor(pensionBase * 0.045 / 10) * 10;
    let pensionEmployer = Math.floor(pensionBase * 0.045 / 10) * 10;
    let pensionTotal = pensionWorker + pensionEmployer;
    const pensionFormula = `${pensionBase.toLocaleString()}원 × 4.5%`;

    return {
        total: pensionTotal,
        worker: pensionWorker,
        employer: pensionEmployer,
        formula: pensionFormula
    };
}

// 건강보험 계산 (건강보험 + 장기요양보험)
export function calculateHealthInsurance(income: number, taxfree: number = 0) {
    let base = income - taxfree;
    if (base < 0) base = 0;

    // 건강보험 기준액 계산
    let healthBase = base;
    if (healthBase > 12705698) healthBase = 12705698;
    if (healthBase < 279266) healthBase = 279266;

    // 건강보험료 계산
    let healthWorker = parseInt((healthBase * 0.03545).toString(), 10);
    let healthEmployer = parseInt((healthBase * 0.03545).toString(), 10);
    let healthTotal = healthWorker + healthEmployer;
    const healthFormula = `${healthBase.toLocaleString()}원 × 3.545%`;

    // 장기요양보험료 계산
    let careWorker = parseInt((healthBase * 0.004591).toString(), 10);
    let careEmployer = parseInt((healthBase * 0.004591).toString(), 10);
    let careTotal = careWorker + careEmployer;
    const careFormula = `${healthBase.toLocaleString()}원 × 0.4591%`;

    return {
        health: {
            total: healthTotal,
            worker: healthWorker,
            employer: healthEmployer,
            formula: healthFormula
        },
        longTermCare: {
            total: careTotal,
            worker: careWorker,
            employer: careEmployer,
            formula: careFormula
        }
    };
}

// 고용보험 계산 (실업급여 + 고용안정)
export function calculateEmploymentInsurance(income: number, taxfree: number = 0, empType: string) {
    let base = income - taxfree;
    if (base < 0) base = 0;

    // 실업급여 계산
    let empUnempRate = 0.009;
    let empWorkerUnemp = parseInt((base * empUnempRate).toString(), 10);
    let empEmployerUnemp = parseInt((base * empUnempRate).toString(), 10);
    let empUnempTotal = empWorkerUnemp + empEmployerUnemp;
    const empUnempFormula = `${base.toLocaleString()}원 × 0.9%`;

    // 고용안정·직업능력개발 계산
    let empStabRate = 0, empStabRateStr = '';
    if (empType === 'lt150') { empStabRate = 0.0025; empStabRateStr = '0.25%'; }
    else if (empType === 'gte150') { empStabRate = 0.0045; empStabRateStr = '0.45%'; }
    else if (empType === 'btw150_999') { empStabRate = 0.0065; empStabRateStr = '0.65%'; }
    else if (empType === 'gte1000') { empStabRate = 0.0085; empStabRateStr = '0.85%'; }

    let empEmployerStab = parseInt((base * empStabRate).toString(), 10);
    let empStabTotal = empEmployerStab; // 근로자 부담 없음
    const empStabFormula = `${base.toLocaleString()}원 × ${empStabRateStr}`;

    return {
        unemployment: {
            total: empUnempTotal,
            worker: empWorkerUnemp,
            employer: empEmployerUnemp,
            formula: empUnempFormula
        },
        stability: {
            total: empStabTotal,
            worker: 0,
            employer: empEmployerStab,
            formula: empStabFormula
        }
    };
}

// 산재보험 계산 (산재보험 + 출퇴근재해 + 임금채권 + 석면피해)
export function calculateIndustrialAccident(income: number, taxfree: number = 0, businessCategory?: string) {
    let base = income - taxfree;
    if (base < 0) base = 0;

    // 산재보험 계산
    let industrialAccidentTotal = 0;
    let industrialAccidentWorker = 0;
    let industrialAccidentEmployer = 0;
    let industrialAccidentFormula = '';

    if (businessCategory) {
        const categoryId = parseInt(businessCategory);
        // TODO: businessRepository 대신 Prisma로 조회하도록 수정 필요
        // const rate = await prisma.companyIndustryCode.findUnique({ where: { id: categoryId } });
        // if (rate) {
        //     const industrialAccidentRate = rate.rate / 1000;
        //     industrialAccidentEmployer = parseInt((base * industrialAccidentRate).toString(), 10);
        //     industrialAccidentTotal = industrialAccidentEmployer;
        //     industrialAccidentFormula = `${base.toLocaleString()}원 × ${rate.rate}‰`;
        // }
    }

    // 출퇴근재해보험 계산
    const commuteRate = 0.0006;
    let commuteEmployer = Math.round(base * commuteRate);
    let commuteTotal = commuteEmployer;
    const commuteFormula = `${base.toLocaleString()}원 × 0.0006%`;

    // 임금채권부담금 계산
    const wageBondRate = 0.0006;
    let wageBondEmployer = Math.round(base * wageBondRate);
    let wageBondTotal = wageBondEmployer;
    const wageBondFormula = `${base.toLocaleString()}원 × 0.0006%`;

    // 석면피해구제분담금 계산
    const asbestosRate = 0.00006;
    let asbestosEmployer = Math.round(base * asbestosRate);
    let asbestosTotal = asbestosEmployer;
    const asbestosFormula = `${base.toLocaleString()}원 × 0.00006%`;

    return {
        industrial: {
            total: industrialAccidentTotal,
            worker: industrialAccidentWorker,
            employer: industrialAccidentEmployer,
            formula: industrialAccidentFormula
        },
        commute: {
            total: commuteTotal,
            worker: 0,
            employer: commuteEmployer,
            formula: commuteFormula
        },
        wageBond: {
            total: wageBondTotal,
            worker: 0,
            employer: wageBondEmployer,
            formula: wageBondFormula
        },
        asbestos: {
            total: asbestosTotal,
            worker: 0,
            employer: asbestosEmployer,
            formula: asbestosFormula
        }
    };
}

// 4대 보험료 통합 계산
export function calculateInsuranceFee(input: InsuranceFeeInput): InsuranceFeeResult | null {
    const { income, taxfree, businessCategory, empType } = input;
    
    if (!income || income < 0) {
        return null;
    }

    // 각 보험별 계산
    const pension = calculateNationalPension(income, taxfree);
    const health = calculateHealthInsurance(income, taxfree);
    const employment = calculateEmploymentInsurance(income, taxfree, empType);
    const industrial = calculateIndustrialAccident(income, taxfree, businessCategory);

    // 합계 계산
    const totalSum = pension.total + health.health.total + health.longTermCare.total + 
                     employment.unemployment.total + employment.stability.total + 
                     industrial.industrial.total + industrial.commute.total + 
                     industrial.wageBond.total + industrial.asbestos.total;
    
    const workerSum = pension.worker + health.health.worker + health.longTermCare.worker + 
                      employment.unemployment.worker + employment.stability.worker + 
                      industrial.industrial.worker + industrial.commute.worker + 
                      industrial.wageBond.worker + industrial.asbestos.worker;
    
    const employerSum = pension.employer + health.health.employer + health.longTermCare.employer + 
                        employment.unemployment.employer + employment.stability.employer + 
                        industrial.industrial.employer + industrial.commute.employer + 
                        industrial.wageBond.employer + industrial.asbestos.employer;

    return {
        rows: [
            { name: '국민연금', total: pension.total, worker: pension.worker, employer: pension.employer, rate: '', formula: pension.formula },
            { name: '건강보험', total: health.health.total, worker: health.health.worker, employer: health.health.employer, rate: '', formula: health.health.formula },
            { name: '장기요양보험', total: health.longTermCare.total, worker: health.longTermCare.worker, employer: health.longTermCare.employer, rate: '', formula: health.longTermCare.formula },
            { name: '고용보험-실업급여', total: employment.unemployment.total, worker: employment.unemployment.worker, employer: employment.unemployment.employer, rate: '', formula: employment.unemployment.formula },
            { name: '고용보험-고용안정', total: employment.stability.total, worker: employment.stability.worker, employer: employment.stability.employer, rate: '', formula: employment.stability.formula },
            { name: '산재보험', total: industrial.industrial.total, worker: industrial.industrial.worker, employer: industrial.industrial.employer, rate: '', formula: industrial.industrial.formula },
            { name: '출퇴근재해보험', total: industrial.commute.total, worker: industrial.commute.worker, employer: industrial.commute.employer, rate: '', formula: industrial.commute.formula },
            { name: '임금채권부담금', total: industrial.wageBond.total, worker: industrial.wageBond.worker, employer: industrial.wageBond.employer, rate: '', formula: industrial.wageBond.formula },
            { name: '석면피해구제분담금', total: industrial.asbestos.total, worker: industrial.asbestos.worker, employer: industrial.asbestos.employer, rate: '', formula: industrial.asbestos.formula },
        ],
        totalSum,
        workerSum,
        employerSum
    };
}