import { PrimaryProfile, Profile } from "@/src/generated/prisma";

export type PrimaryProfileWithProfile = PrimaryProfile & { profile: Profile };

export interface IPriamryProfileRepository {
}
