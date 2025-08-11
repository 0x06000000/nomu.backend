export class DeleteCompanyCommand {
    constructor(public readonly userId: number, public readonly workspaceId: number, public readonly id: number) {
    }
}   