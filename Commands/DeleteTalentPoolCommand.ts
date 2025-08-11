export class DeleteTalentPoolCommand {
    constructor(public readonly userId: number, public readonly workspaceId: number, public readonly id: number) {
    }
}   