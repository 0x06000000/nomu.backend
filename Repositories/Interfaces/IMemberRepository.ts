import { User, Workspace, WorkspaceMember } from "@/src/generated/prisma";

export type MemberWithRelations = WorkspaceMember & {
    user: User;
    workspace: Workspace;
};

export interface IMemberRepository {
    getByWorkspaceId(workspaceId: number): Promise<MemberWithRelations[]>;
    getByUserId(userId: number): Promise<MemberWithRelations | null>;
    getByWorkspaceIdAndUserId(workspaceId: number, userId: number): Promise<MemberWithRelations | null>;
    add(workspaceId: number, userId: number): Promise<MemberWithRelations>;
    delete(workspaceId: number, userId: number): Promise<void>;
}