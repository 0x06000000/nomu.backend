export class CreateWorkspaceCommand {
    public readonly userId: number;
    public readonly name: string;

    constructor(
        userId: number,
        name: string,
    ) {
        this.userId = userId;
        this.name = name;
    }
}
