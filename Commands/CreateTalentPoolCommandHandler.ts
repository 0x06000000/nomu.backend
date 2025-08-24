import { CreateTalentPoolCommand } from "@/Commands/CreateTalentPoolCommand";
import { CreateTalentPoolResponse } from "@/DTOs/CreateTalentPoolResponse";
import { ITalentPoolRepository } from "@/Repositories/Interfaces/ITalentPoolRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { ForbiddenException } from "@/Exceptions/Exceptions";

export class CreateTalentPoolCommandHandler {
    constructor(private readonly talentPoolRepository: ITalentPoolRepository, private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(command: CreateTalentPoolCommand): Promise<CreateTalentPoolResponse> {
        const isMember = await this.workspaceRepository.existsMember(command.workspaceId, command.userId);

        if (!isMember) {
            throw new ForbiddenException("워크스페이스 멤버가 아닙니다.");
        }

        const talentPool = await this.talentPoolRepository.add(command.workspaceId, command.name, command.birthday, command.phone, command.address, command.memo);
        return new CreateTalentPoolResponse(talentPool);
    }
}
