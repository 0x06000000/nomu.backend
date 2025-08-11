import { Company, Site, TalentPool, Workspace, WorkspaceMember, WorkspaceOwner } from "@/src/generated/prisma";

export type WorkspaceWithRelations = Workspace & {
    companies: Company[];
    sites: Site[];
    talentPools: TalentPool[];
    workspaceMembers: WorkspaceMember[];
    workspaceOwners: WorkspaceOwner[];
};

export interface IWorkspaceRepository {
    existsMember(workspaceId: number, userId: number): Promise<boolean>;
    add(name: string, createdBy: number): Promise<WorkspaceWithRelations>;
    update(workspaceId: number, name: string): Promise<WorkspaceWithRelations>;
    delete(workspaceId: number): Promise<void>;
    getById(workspaceId: number): Promise<WorkspaceWithRelations | null>;
    getByUserId(userId: number): Promise<WorkspaceWithRelations[]>;
}