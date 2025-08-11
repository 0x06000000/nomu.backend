export class GetSiteAttendancesByTalentPoolIdQuery {
    public readonly workspaceId: number;
    public readonly userId: number;
    public readonly talentPoolId: number;

    constructor(workspaceId: number, userId: number, talentPoolId: number) {
        this.workspaceId = workspaceId;
        this.userId = userId;
        this.talentPoolId = talentPoolId;
    }
}       