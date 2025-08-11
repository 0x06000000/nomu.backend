export class UpdateSiteCommand {
    public readonly workspaceId: number;
    public readonly userId: number;
    public readonly id: number;
    public readonly companyId: number;
    public readonly name: string;
    public readonly location: string;
    public readonly startDate: Date;
    public readonly endDate: Date;
    public readonly memo?: string;

    constructor(workspaceId: number, userId: number, id: number, companyId: number, name: string, location: string, startDate: Date, endDate: Date, memo?: string) {
        this.workspaceId = workspaceId;
        this.userId = userId;
        this.id = id;
        this.companyId = companyId;
        this.name = name;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
        this.memo = memo;
    }
}
