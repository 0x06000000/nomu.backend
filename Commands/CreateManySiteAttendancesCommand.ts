export class CreateManySiteAttendancesCommand {
    public readonly workspaceId: number;
    public readonly userId: number;
    public readonly talentPoolId: number;
    public readonly siteAttendances: { siteId: number, date: Date, startTime: Date, endTime: Date, amount: number }[];

    constructor(workspaceId: number, userId: number, talentPoolId: number, siteAttendances: { siteId: number, date: Date, startTime: Date, endTime: Date, amount: number }[]) {
        this.workspaceId = workspaceId;
        this.userId = userId;
        this.talentPoolId = talentPoolId;
        this.siteAttendances = siteAttendances;
    }
}