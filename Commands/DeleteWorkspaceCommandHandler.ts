import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { DeleteWorkspaceCommand } from "./DeleteWorkspaceCommand";
import { ForbiddenException } from "@/Exceptions/Exceptions";

export class DeleteWorkspaceCommandHandler {
    constructor(private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(command: DeleteWorkspaceCommand): Promise<void> {
        const isMember = await this.workspaceRepository.existsMember(command.userId, command.id);

        if (!isMember) {
            throw new ForbiddenException("워크스페이스 멤버가 아닙니다.");
        }

        await this.workspaceRepository.delete(command.id);
    }
}       