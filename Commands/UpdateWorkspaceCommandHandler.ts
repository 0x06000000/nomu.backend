import { UpdateWorkspaceCommand } from "@/Commands/UpdateWorkspaceCommand";
import { UpdateWorkspaceResponse } from "@/DTOs/UpdateWorkspaceResponse";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";

export class UpdateWorkspaceCommandHandler {
    constructor(private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(command: UpdateWorkspaceCommand): Promise<UpdateWorkspaceResponse> {

        const isMember = await this.workspaceRepository.existsMember(command.id, command.userId);

        if (!isMember) {
            throw new Error("워크스페이스 멤버가 아닙니다.");
        }

        const workspace = await this.workspaceRepository.update(command.id, command.name);
        return new UpdateWorkspaceResponse(workspace);
    }
}