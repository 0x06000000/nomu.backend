import { TalentPoolWithRelations } from "@/Repositories/Interfaces/ITalentPoolRepository";

export class GetTalentPoolsResponse {
    constructor(public readonly talentPools: TalentPoolWithRelations[]) {
    }
}   