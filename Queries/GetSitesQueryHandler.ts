import { GetSitesQuery } from "@/Queries/GetSitesQuery";
import { GetSitesResponse } from "@/DTOs/GetSitesResponse";
import { ISiteRepository } from "@/Repositories/Interfaces/ISiteRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";

export class GetSitesQueryHandler {
    constructor(private readonly siteRepository: ISiteRepository, private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(query: GetSitesQuery): Promise<GetSitesResponse> {
        const isMember = await this.workspaceRepository.existsMember(query.workspaceId, query.userId);
        if (!isMember) {
            throw new Error("워크스페이스 멤버가 아닙니다.");
        }

        const sites = await this.siteRepository.getByWorkspaceId(query.workspaceId);
        return new GetSitesResponse(sites);
    }
}