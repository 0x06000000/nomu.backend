export class UpsertAndDeleteManySiteAttendancesCommand {
    public readonly workspaceId: number;
    public readonly userId: number;
    public readonly talentPoolId: number;
    public readonly operations: {
        upsert?: { id?: number, siteId: number, date: Date, startTime: Date, endTime: Date, amount: number }[],
        delete?: number[]
    };

    constructor(workspaceId: number, userId: number, talentPoolId: number, operations: {
        upsert?: { id?: number, siteId: number, date: Date, startTime: Date, endTime: Date, amount: number }[],
        delete?: number[]   
    }) {
        this.workspaceId = workspaceId;
        this.userId = userId;
        this.talentPoolId = talentPoolId;
        this.operations = operations;
    }
}       