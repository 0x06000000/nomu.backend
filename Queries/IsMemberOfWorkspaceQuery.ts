export class IsMemberOfWorkspaceQuery {
    constructor(
        public readonly workspaceId: number,
        public readonly userId: number,
    ) {
    }
}   