import { WorkspaceWithRelations } from "@/Repositories/Interfaces/IWorkspaceRepository";

export class UpdateWorkspaceResponse {
    public readonly id: number;
    public readonly name: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(workspace: WorkspaceWithRelations) {
        this.id = workspace.id;
        this.name = workspace.name;
        this.createdAt = workspace.createdAt;
        this.updatedAt = workspace.updatedAt;
    }
}