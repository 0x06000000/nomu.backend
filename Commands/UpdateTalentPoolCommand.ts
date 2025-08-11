export class UpdateTalentPoolCommand {
    public readonly workspaceId: number;
    public readonly userId: number;
    public readonly id: number;
    public readonly name: string;
    public readonly birthday: Date;
    public readonly phone: string;
    public readonly address: string;
    public readonly memo?: string;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;

    constructor(workspaceId: number, userId: number, id: number, name: string, birthday: Date, phone: string, address: string, memo?: string) {
        this.workspaceId = workspaceId;
        this.userId = userId;
        this.id = id;
        this.name = name;
        this.birthday = birthday;
        this.phone = phone;
        this.address = address;
        this.memo = memo;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}