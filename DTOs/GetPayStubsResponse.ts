import { TalentPool } from "@/src/generated/prisma";

export class WorkerResponse {
    public readonly id: number;
    public readonly name: string;
    public readonly birthday: Date;
    public readonly phone: string;

    constructor(worker: TalentPool) {
        this.id = worker.id;
        this.name = worker.name;
        this.birthday = worker.birthday;
        this.phone = worker.phone;
    }
}

export class PayStubResponse {
    public readonly worker: WorkerResponse;
    public readonly workDays: number;
    public readonly workHours: number;
    public readonly totalAmount: number;
    public readonly nationalPension: number;
    public readonly healthInsurance: number;
    public readonly longTermCare: number;
    public readonly employmentInsurance: number;
    public readonly incomeTax: number;
    public readonly localIncomeTax: number;
    public readonly netSalary: number;

    constructor(talentPool: TalentPool, workDays: number, workHours: number, totalAmount: number, nationalPension: number, healthInsurance: number, longTermCare: number, employmentInsurance: number, incomeTax: number, localIncomeTax: number, netSalary: number) {
        this.worker = new WorkerResponse(talentPool);
        this.workDays = workDays;
        this.workHours = workHours;
        this.totalAmount = totalAmount;
        this.nationalPension = nationalPension;
        this.healthInsurance = healthInsurance;
        this.longTermCare = longTermCare;
        this.employmentInsurance = employmentInsurance;
        this.incomeTax = incomeTax;
        this.localIncomeTax = localIncomeTax;
        this.netSalary = netSalary;
    }
}

export class GetPayStubsResponse {
    public readonly payStubs: PayStubResponse[];

    constructor(payStubs: PayStubResponse[]) {
        this.payStubs = payStubs;
    }
}