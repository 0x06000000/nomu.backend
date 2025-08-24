import { UpdateSiteCommand } from "@/Commands/UpdateSiteCommand";
import { UpdateSiteResponse } from "@/DTOs/UpdateSiteResponse";
import { ISiteRepository } from "@/Repositories/Interfaces/ISiteRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { ForbiddenException } from "@/Exceptions/Exceptions";

export class UpdateSiteCommandHandler {
    constructor(private readonly siteRepository: ISiteRepository, private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(command: UpdateSiteCommand): Promise<UpdateSiteResponse> {
        const isMember = await this.workspaceRepository.existsMember(command.workspaceId, command.userId);

        if (!isMember) {
            throw new ForbiddenException("워크스페이스 멤버가 아닙니다.");
        }

        const site = await this.siteRepository.update(command.id, command.companyId, command.name, command.location, command.startDate, command.endDate, command.managementNumber, command.memo);
        return new UpdateSiteResponse(site);
    }
}
