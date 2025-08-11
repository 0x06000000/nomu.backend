import { TalentPoolWithRelations } from "@/Repositories/Interfaces/ITalentPoolRepository";

export class CreateTalentPoolResponse {
    public readonly id: number;
    public readonly name: string;
    public readonly birthday: Date;
    public readonly phone: string;
    public readonly address: string;

    constructor(talentPool: TalentPoolWithRelations) {
        this.id = talentPool.id;
        this.name = talentPool.name;
        this.birthday = talentPool.birthday;
        this.phone = talentPool.phone;
        this.address = talentPool.address;
    }
}   