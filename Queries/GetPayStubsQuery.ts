export class GetPayStubsQuery {
    public readonly workspaceId: number;
    public readonly userId: number;
    public readonly siteId?: number;
    public readonly year: number;
    public readonly month: number;

    constructor(userId: number, workspaceId: number, year: number, month: number, siteId?: number) {
        this.userId = userId;
        this.workspaceId = workspaceId;
        this.siteId = siteId;
        this.year = year;
        this.month = month;
    }
}