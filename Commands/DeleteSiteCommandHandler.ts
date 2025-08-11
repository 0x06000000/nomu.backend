import { ISiteRepository } from "@/Repositories/Interfaces/ISiteRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { DeleteSiteCommand } from "./DeleteSiteCommand";

export class DeleteSiteCommandHandler {
    constructor(private readonly siteRepository: ISiteRepository, private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(command: DeleteSiteCommand): Promise<void> {
        const isMember = await this.workspaceRepository.existsMember(command.workspaceId, command.userId);

        if (!isMember) {
            throw new Error("워크스페이스 멤버가 아닙니다.");
        }

        await this.siteRepository.delete(command.id);
    }
}       