// 사용자 리포지토리 인터페이스

import { Profile, User } from "@/src/generated/prisma";
import { PrimaryProfileWithProfile } from "./IPriamryProfileRepository";

export type UserWithProfile = User & { profiles: Profile[], primaryProfile: PrimaryProfileWithProfile | null };

export interface IUserRepository {
  add(email: string, name: string, birthday?: Date, address?: string, phone?: string): Promise<UserWithProfile>;
  getById(id: number): Promise<UserWithProfile | null>;
  getByEmail(email: string): Promise<UserWithProfile | null>;
}
