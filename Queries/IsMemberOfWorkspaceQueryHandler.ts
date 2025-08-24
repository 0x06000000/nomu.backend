import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { IsMemberOfWorkspaceQuery } from "./IsMemberOfWorkspaceQuery";

export class IsMemberOfWorkspaceQueryHandler {
    constructor(private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(query: IsMemberOfWorkspaceQuery): Promise<boolean> {
        const isMember = await this.workspaceRepository.existsMember(query.workspaceId, query.userId);
        return isMember;
    }
}   