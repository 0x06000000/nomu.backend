import { D1Database } from "@cloudflare/workers-types";
import { createPrismaClient } from "@/lib/prisma";
import { PrismaClient, Profile } from "@/src/generated/prisma";
import { IProfileRepository, ProfileWithUser } from "../Interfaces/IProfileRepository";

export class ProfileRepository implements IProfileRepository {
    private prisma: PrismaClient;
    constructor(db: D1Database) {
        this.prisma = createPrismaClient(db);
    }

    async getByUserId(userId: number): Promise<ProfileWithUser | null> {
        const profile = await this.prisma.profile.findFirst({
            where: {
                userId: userId
            },
            include: {
                user: true
            }
        });

        return profile;
    }

    async add(userId: number, name: string, birthday?: Date, address?: string, phone?: string): Promise<ProfileWithUser> {
        const profile = await this.prisma.profile.create({
            data: {
                userId,
                name,
                birthday,
                address,
                phone
            },
            include: {
                user: true,
            }
        });

        return profile; 
    }

    async update(profile: Profile, name: string, birthday?: Date, address?: string, phone?: string): Promise<ProfileWithUser> {
        const updatedProfile = await this.prisma.profile.update({
            where: { id: profile.id },
            data: {
                name,
                birthday,
                address,
                phone
            },
            include: {
                user: true
            }
        });

        return updatedProfile;
    }

    async delete(profile: Profile): Promise<void> {
        await this.prisma.profile.delete({
            where: { id: profile.id }
        });
    }
}