import { Profile, User } from "@/src/generated/prisma";

export type ProfileWithUser = Profile & { user: User | null };

export interface IProfileRepository {
    getByUserId(userId: number): Promise<ProfileWithUser | null>;
    add(userId: number, name: string, birthday?: Date, address?: string, phone?: string): Promise<ProfileWithUser>;
    update(profile: Profile, name: string, birthday?: Date, address?: string, phone?: string): Promise<ProfileWithUser>;
    delete(profile: Profile): Promise<void>;
}
