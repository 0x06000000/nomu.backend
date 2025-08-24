export class GetSecondLevelsQuery {
    public readonly firstLevelCode: number;

    constructor(firstLevelCode: number) {
        this.firstLevelCode = firstLevelCode;
    }
}