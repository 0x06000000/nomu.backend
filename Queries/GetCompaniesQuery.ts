export class GetCompaniesQuery {
    public readonly userId: number;
    public readonly workspaceId: number;

    constructor(userId: number, workspaceId: number) {
        this.userId = userId;
        this.workspaceId = workspaceId;
    }
}   