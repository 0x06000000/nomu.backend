export class GetIndustriesQuery {
    public readonly firstLevelCode: number;
    public readonly secondLevelCode: number;

    constructor(firstLevelCode: number, secondLevelCode: number) {
        this.firstLevelCode = firstLevelCode;
        this.secondLevelCode = secondLevelCode;
    }
}