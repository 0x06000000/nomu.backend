export class GetWorkspacesQuery {
    public readonly userId: number;

    constructor(userId: number) {
        this.userId = userId;
    }
}   