import { CreateSiteCommand } from "@/Commands/CreateSiteCommand";
import { CreateSiteResponse } from "@/DTOs/CreateSiteResponse";
import { ISiteRepository } from "@/Repositories/Interfaces/ISiteRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { ForbiddenException } from "@/Exceptions/Exceptions";

export class CreateSiteCommandHandler {
    constructor(private readonly siteRepository: ISiteRepository, private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(command: CreateSiteCommand): Promise<CreateSiteResponse> {
        const isMember = await this.workspaceRepository.existsMember(command.workspaceId, command.userId);

        if (!isMember) {
            throw new ForbiddenException("워크스페이스 멤버가 아닙니다.");
        }

        const site = await this.siteRepository.add(command.workspaceId, command.companyId, command.name, command.location, command.startDate, command.endDate, command.memo);
        return new CreateSiteResponse(site);
    }
}
