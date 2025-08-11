export class CreateCompanyCommand {
    public readonly workspaceId: number;
    public readonly name: string;
    public readonly location: string;
    public readonly employeeCount: number;
    public readonly createdBy: number;
    public readonly businessNumber?: string;
    public readonly managementNumber?: string;

    constructor(
        workspaceId: number,
        name: string,
        location: string,
        employeeCount: number,
        createdBy: number,
        businessNumber?: string,
        managementNumber?: string
    ) {
        this.workspaceId = workspaceId;
        this.name = name;
        this.location = location;
        this.employeeCount = employeeCount;
        this.createdBy = createdBy;
        this.businessNumber = businessNumber;
        this.managementNumber = managementNumber;
    }
}