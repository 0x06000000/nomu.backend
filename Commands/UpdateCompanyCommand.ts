export class UpdateCompanyCommand {
    public readonly id: number;
    public readonly workspaceId: number;
    public readonly userId: number;
    public readonly name: string;
    public readonly location: string;
    public readonly employeeCount: number;
    public readonly businessNumber?: string;
    public readonly managementNumber?: string;

    constructor(
        id: number,
        workspaceId: number,
        userId: number,
        name: string,
        location: string,
        employeeCount: number,
        businessNumber?: string,
        managementNumber?: string
    ) {
        this.id = id;
        this.workspaceId = workspaceId;
        this.userId = userId;
        this.name = name;
        this.location = location;
        this.employeeCount = employeeCount;
        this.businessNumber = businessNumber;
        this.managementNumber = managementNumber;
    }
}