import { ISiteAttendanceRepository } from "@/Repositories/Interfaces/ISiteAttendanceRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { ITalentPoolRepository } from "@/Repositories/Interfaces/ITalentPoolRepository";
import { GetSiteAttendancesByTalentPoolIdQuery } from "@/Queries/GetSiteAttendancesByTalentPoolIdQuery";
import { GetSiteAttendancesByTalentPoolIdResponse } from "@/DTOs/GetSiteAttendancesByTalentPoolIdResponse";

export class GetSiteAttendancesByTalentPoolIdQueryHandler {
    constructor(private readonly siteAttendanceRepository: ISiteAttendanceRepository, private readonly workspaceRepository: IWorkspaceRepository, private readonly talentPoolRepository: ITalentPoolRepository) {
    }

    async handle(query: GetSiteAttendancesByTalentPoolIdQuery): Promise<GetSiteAttendancesByTalentPoolIdResponse> {
        const isMember = await this.workspaceRepository.existsMember(query.workspaceId, query.userId);
        if (!isMember) {
            throw new Error("워크스페이스 멤버가 아닙니다.");
        }

        const talentPool = await this.talentPoolRepository.getById(query.talentPoolId);
        if (!talentPool) {
            throw new Error("근로자 정보가 존재하지 않습니다.");
        }

        const siteAttendances = await this.siteAttendanceRepository.getByTalentPoolId(query.talentPoolId);
        return new GetSiteAttendancesByTalentPoolIdResponse(siteAttendances);
    }
}   