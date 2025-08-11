import { CreateWorkspaceCommand } from "@/Commands/CreateWorkspaceCommand";
import { CreateWorkspaceResponse } from "@/DTOs/CreateWorkspaceResponse";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";

export class CreateWorkspaceCommandHandler {
    constructor(private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(command: CreateWorkspaceCommand): Promise<CreateWorkspaceResponse> {
        const workspace = await this.workspaceRepository.add(command.name, command.userId);
        return new CreateWorkspaceResponse(workspace);
    }
}