import { D1Database } from "@cloudflare/workers-types";
import { createPrismaClient } from "@/lib/prisma";
import { IUserRepository, UserWithProfile } from "@/Repositories/Interfaces/IUserRepository";
import { PrismaClient, Profile, User } from "@/src/generated/prisma";

export class UserRepository implements IUserRepository {
    private prisma: PrismaClient;
    constructor(db: D1Database) {
        this.prisma = createPrismaClient(db);
    }

    async add(email: string, name: string, birthday?: Date, address?: string, phone?: string): Promise<UserWithProfile> {
        const user = await this.prisma.user.create({
            data: {
                email,
                primaryProfile: {
                    create: {
                        profile: {
                            create: {
                                name,
                                birthday,
                                address,
                                phone,
                            }
                        }

                    }
                },
            },
            include: {
                profiles: true,
                primaryProfile: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        return user;
    }

    async getByEmail(email: string): Promise<UserWithProfile | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                profiles: true,
                primaryProfile: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        return user;
    }
}