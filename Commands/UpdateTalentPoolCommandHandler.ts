import { ITalentPoolRepository } from "@/Repositories/Interfaces/ITalentPoolRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { UpdateTalentPoolCommand } from "@/Commands/UpdateTalentPoolCommand";
import { UpdateTalentPoolResponse } from "@/DTOs/UpdateTalentPoolResponse";
import { ForbiddenException } from "@/Exceptions/Exceptions";

export class UpdateTalentPoolCommandHandler {
    constructor(private readonly talentPoolRepository: ITalentPoolRepository, private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(command: UpdateTalentPoolCommand): Promise<UpdateTalentPoolResponse> {
        const isMember = await this.workspaceRepository.existsMember(command.workspaceId, command.userId);

        if (!isMember) {
            throw new ForbiddenException("워크스페이스 멤버가 아닙니다.");
        }

        const talentPool = await this.talentPoolRepository.update(command.id, command.name, command.birthday, command.phone, command.address, command.memo);
        return new UpdateTalentPoolResponse(talentPool);
    }
}   