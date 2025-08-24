import { GetTalentPoolsQuery } from "@/Queries/GetTalentPoolsQuery";
import { GetTalentPoolsResponse } from "@/DTOs/GetTalentPoolsResponse";
import { ITalentPoolRepository } from "@/Repositories/Interfaces/ITalentPoolRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { ForbiddenException } from "@/Exceptions/Exceptions";

export class GetTalentPoolsQueryHandler {
    constructor(private readonly talentPoolRepository: ITalentPoolRepository, private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(query: GetTalentPoolsQuery): Promise<GetTalentPoolsResponse> {
        const isMember = await this.workspaceRepository.existsMember(query.workspaceId, query.userId);
        if (!isMember) {
            throw new ForbiddenException("워크스페이스 멤버가 아닙니다.");
        }

        const talentPools = await this.talentPoolRepository.getByWorkspaceId(query.workspaceId);
        return new GetTalentPoolsResponse(talentPools);
    }
}       