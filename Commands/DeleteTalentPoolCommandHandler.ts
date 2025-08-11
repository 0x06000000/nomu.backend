import { ITalentPoolRepository } from "@/Repositories/Interfaces/ITalentPoolRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { DeleteTalentPoolCommand } from "./DeleteTalentPoolCommand";

export class DeleteTalentPoolCommandHandler {
    constructor(private readonly talentPoolRepository: ITalentPoolRepository, private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(command: DeleteTalentPoolCommand): Promise<void> {
        const isMember = await this.workspaceRepository.existsMember(command.workspaceId, command.userId);

        if (!isMember) {
            throw new Error("워크스페이스 멤버가 아닙니다.");
        }

        await this.talentPoolRepository.delete(command.id);
    }
}       