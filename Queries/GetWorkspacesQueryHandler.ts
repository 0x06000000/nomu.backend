import { GetWorkspacesQuery } from "@/Queries/GetWorkspacesQuery";
import { GetWorkspacesResponse } from "@/DTOs/GetWorkspacesResponse";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";

export class GetWorkspacesQueryHandler {
    constructor(private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(query: GetWorkspacesQuery): Promise<GetWorkspacesResponse> {
        const workspaces = await this.workspaceRepository.getByUserId(query.userId);
        return new GetWorkspacesResponse(workspaces);
    }
}   