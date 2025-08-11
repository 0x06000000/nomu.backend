export class NaverLoginResponse {
    public readonly accessToken: string;
    public readonly userId: number;
    public readonly name: string;

    constructor(accessToken: string, userId: number, name: string) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.name = name;
    }
};