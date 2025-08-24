export class NaverLoginResponse {
    public readonly accessToken: string;
    public readonly userId: number;
    public readonly name: string;
    public readonly redirectUrl: string;

    constructor(accessToken: string, userId: number, name: string, redirectUrl: string) {
        this.accessToken = accessToken;
        this.userId = userId;
        this.name = name;
        this.redirectUrl = redirectUrl;
    }
};