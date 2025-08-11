export class DeleteSiteCommand {
    public readonly workspaceId: number;
    public readonly userId: number;
    public readonly id: number;

    constructor(workspaceId: number, userId: number, id: number) {
        this.workspaceId = workspaceId;
        this.userId = userId;
        this.id = id;
    }
}   