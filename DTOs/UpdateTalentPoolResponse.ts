import { TalentPoolWithRelations } from "@/Repositories/Interfaces/ITalentPoolRepository";

export class UpdateTalentPoolResponse {
    public readonly id: number;
    public readonly name: string;
    public readonly birthday: Date;
    public readonly phone: string;
    public readonly address: string;
    public readonly memo: string | null;

    constructor(talentPool: TalentPoolWithRelations) {
        this.id = talentPool.id;
        this.name = talentPool.name;
        this.birthday = talentPool.birthday;
        this.phone = talentPool.phone;
        this.address = talentPool.address;
        this.memo = talentPool.memo;
    }
}   