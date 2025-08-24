import { UserWithProfile } from "@/Repositories/Interfaces/IUserRepository";
import { PrimaryProfileWithProfile } from "@/Repositories/Interfaces/IPriamryProfileRepository";
import { Profile } from "@/src/generated/prisma";

export class GetMeResponse {
    public readonly id: number;
    public readonly email: string;
    public readonly primaryProfile?: Profile;
    public readonly profiles: Profile[];

    constructor(user: UserWithProfile) {
        this.id = user.id;
        this.email = user.email;
        this.primaryProfile = user.primaryProfile?.profile;
        this.profiles = user.profiles;
        console.log(user.profiles);
    }
}   