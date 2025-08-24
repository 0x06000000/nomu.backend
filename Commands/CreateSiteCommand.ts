export class CreateSiteCommand {
    public readonly workspaceId: number;
    public readonly userId: number;
    public readonly companyId: number;
    public readonly name: string;
    public readonly location: string;
    public readonly startDate: Date;
    public readonly endDate: Date;
    public readonly managementNumber?: string;
    public readonly memo?: string;

    constructor(
        workspaceId: number,
        userId: number,
        companyId: number,
        name: string,
        location: string,
        startDate: Date,
        endDate: Date,
        managementNumber?: string,
        memo?: string
    ) {
        this.workspaceId = workspaceId;
        this.userId = userId;
        this.companyId = companyId;
        this.name = name;
        this.location = location;
        this.startDate = startDate;
        this.endDate = endDate;
        this.managementNumber = managementNumber;
        this.memo = memo;
    }
}
