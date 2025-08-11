export class NaverLoginCommand {
    public readonly code: string;
    public readonly state: string;

    constructor(code: string, state: string) {
        this.code = code;
        this.state = state;
    }
}