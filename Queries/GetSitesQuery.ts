export class GetSitesQuery {
    public readonly workspaceId: number;
    public readonly userId: number;

    constructor(workspaceId: number, userId: number) {
        this.workspaceId = workspaceId;
        this.userId = userId;
    }
}   