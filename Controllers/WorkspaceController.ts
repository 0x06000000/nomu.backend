import { Env } from "@/common/Env";
import { Factory } from "@/lib/factory";
import { TokenClaims } from "@/lib/jwt";
import { CreateWorkspaceCommand } from "@/Commands/CreateWorkspaceCommand";
import { CreateWorkspaceCommandHandler } from "@/Commands/CreateWorkspaceCommandHandler";
import { DeleteWorkspaceCommand } from "@/Commands/DeleteWorkspaceCommand";
import { DeleteWorkspaceCommandHandler } from "@/Commands/DeleteWorkspaceCommandHandler";
import { UpdateWorkspaceCommand } from "@/Commands/UpdateWorkspaceCommand";
import { UpdateWorkspaceCommandHandler } from "@/Commands/UpdateWorkspaceCommandHandler";
import { GetWorkspacesQuery } from "@/Queries/GetWorkspacesQuery";
import { GetWorkspacesQueryHandler } from "@/Queries/GetWorkspacesQueryHandler";
import { GetCompaniesQuery } from "@/Queries/GetCompaniesQuery";
import { GetCompaniesQueryHandler } from "@/Queries/GetCompaniesQueryHandler";
import { GetTalentPoolsQuery } from "@/Queries/GetTalentPoolsQuery";
import { GetTalentPoolsQueryHandler } from "@/Queries/GetTalentPoolsQueryHandler";
import { GetSitesQuery } from "@/Queries/GetSitesQuery";
import { GetSitesQueryHandler } from "@/Queries/GetSitesQueryHandler";
import { GetSiteAttendancesByTalentPoolIdQuery } from "@/Queries/GetSiteAttendancesByTalentPoolIdQuery";
import { GetSiteAttendancesByTalentPoolIdQueryHandler } from "@/Queries/GetSiteAttendancesByTalentPoolIdQueryHandler";
import { CreateCompanyCommand } from "@/Commands/CreateCompanyCommand";
import { CreateCompanyCommandHandler } from "@/Commands/CreateCompanyCommandHandler";
import { UpdateCompanyCommand } from "@/Commands/UpdateCompanyCommand";
import { UpdateCompanyCommandHandler } from "@/Commands/UpdateCompanyCommandHandler";
import { DeleteCompanyCommand } from "@/Commands/DeleteCompanyCommand";
import { DeleteCompanyCommandHandler } from "@/Commands/DeleteCompanyCommandHandler";
import { CreateSiteCommand } from "@/Commands/CreateSiteCommand";
import { CreateSiteCommandHandler } from "@/Commands/CreateSiteCommandHandler";
import { UpdateSiteCommand } from "@/Commands/UpdateSiteCommand";
import { UpdateSiteCommandHandler } from "@/Commands/UpdateSiteCommandHandler";
import { DeleteSiteCommand } from "@/Commands/DeleteSiteCommand";
import { DeleteSiteCommandHandler } from "@/Commands/DeleteSiteCommandHandler";
import { CreateTalentPoolCommand } from "@/Commands/CreateTalentPoolCommand";
import { CreateTalentPoolCommandHandler } from "@/Commands/CreateTalentPoolCommandHandler";
import { UpdateTalentPoolCommand } from "@/Commands/UpdateTalentPoolCommand";
import { UpdateTalentPoolCommandHandler } from "@/Commands/UpdateTalentPoolCommandHandler";
import { DeleteTalentPoolCommand } from "@/Commands/DeleteTalentPoolCommand";
import { DeleteTalentPoolCommandHandler } from "@/Commands/DeleteTalentPoolCommandHandler";
import { CreateManySiteAttendancesCommand } from "@/Commands/CreateManySiteAttendancesCommand";
import { CreateManySiteAttendancesCommandHandler } from "@/Commands/CreateManySiteAttendancesCommandHandler";
import { UpsertAndDeleteManySiteAttendancesCommand } from "@/Commands/UpsertAndDeleteManySiteAttendancesCommand";
import { UpsertAndDeleteManySiteAttendancesCommandHandler } from "@/Commands/UpsertAndDeleteManySiteAttendancesCommandHandler";

export class WorkspaceController {
    static async create(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const body = await request.json();

        const command = new CreateWorkspaceCommand(userClaims.userId, body.name);
        await new CreateWorkspaceCommandHandler(Factory.createWorkspaceRepository(env)).handle(command);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async update(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const body = await request.json();

        const url = new URL(request.url);
        const workspaceId = parseInt(url.pathname.split('/')[2]);

        const command = new UpdateWorkspaceCommand(workspaceId, body.name, userClaims.userId);
        await new UpdateWorkspaceCommandHandler(Factory.createWorkspaceRepository(env)).handle(command);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async delete(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const workspaceId = parseInt(url.pathname.split('/')[2]);

        const command = new DeleteWorkspaceCommand(userClaims.userId, workspaceId);
        await new DeleteWorkspaceCommandHandler(Factory.createWorkspaceRepository(env)).handle(command);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async getWorkspaces(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const query = new GetWorkspacesQuery(userClaims.userId);
        const result = await new GetWorkspacesQueryHandler(Factory.createWorkspaceRepository(env)).handle(query);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async getCompanies(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const url = new URL(request.url);

        const workspaceId = parseInt(url.pathname.split('/')[2]);

        const query = new GetCompaniesQuery(userClaims.userId, workspaceId);
        const result = await new GetCompaniesQueryHandler(Factory.createCompanyRepository(env), Factory.createWorkspaceRepository(env)).handle(query);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async getSites(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const workspaceId = parseInt(url.pathname.split('/')[2]);
        const query = new GetSitesQuery(userClaims.userId, workspaceId);
        const result = await new GetSitesQueryHandler(Factory.createSiteRepository(env), Factory.createWorkspaceRepository(env)).handle(query);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async getTalentPools(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const url = new URL(request.url);

        const workspaceId = parseInt(url.pathname.split('/')[2]);

        const query = new GetTalentPoolsQuery(userClaims.userId, workspaceId);
        const result = await new GetTalentPoolsQueryHandler(Factory.createTalentPoolRepository(env), Factory.createWorkspaceRepository(env)).handle(query);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async getSiteAttendancesByTalentPoolId(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const workspaceId = parseInt(url.pathname.split('/')[2]);
        const talentPoolId = parseInt(url.pathname.split('/')[4]);
        const query = new GetSiteAttendancesByTalentPoolIdQuery(userClaims.userId, workspaceId, talentPoolId);
        const result = await new GetSiteAttendancesByTalentPoolIdQueryHandler(Factory.createSiteAttendanceRepository(env), Factory.createWorkspaceRepository(env), Factory.createTalentPoolRepository(env)).handle(query);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async createCompany(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const body = await request.json();

        const url = new URL(request.url);
        const workspaceId = parseInt(url.pathname.split('/')[2]);

        const command = new CreateCompanyCommand(workspaceId, body.name, body.location, body.employeeCount, userClaims.userId, body.businessNumber, body.managementNumber);
        const result = await new CreateCompanyCommandHandler(Factory.createCompanyRepository(env), Factory.createWorkspaceRepository(env)).handle(command);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async updateCompany(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const body = await request.json();

        const url = new URL(request.url);
        const workspaceId = parseInt(url.pathname.split('/')[2]);
        const companyId = parseInt(url.pathname.split('/')[4]);

        const command = new UpdateCompanyCommand(companyId, workspaceId, userClaims.userId, body.name, body.location, body.employeeCount, body.businessNumber, body.managementNumber);
        const result = await new UpdateCompanyCommandHandler(Factory.createCompanyRepository(env), Factory.createWorkspaceRepository(env)).handle(command);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async deleteCompany(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const workspaceId = parseInt(url.pathname.split('/')[2]);
        const companyId = parseInt(url.pathname.split('/')[4]);

        const command = new DeleteCompanyCommand(userClaims.userId, workspaceId, companyId);
        await new DeleteCompanyCommandHandler(Factory.createCompanyRepository(env), Factory.createWorkspaceRepository(env)).handle(command);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async createSite(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const body = await request.json();

        const url = new URL(request.url);
        const workspaceId = parseInt(url.pathname.split('/')[2]);

        const startDate = new Date(body.startDate);
        const endDate = new Date(body.endDate);

        const command = new CreateSiteCommand(workspaceId, userClaims.userId, body.companyId, body.name, body.location, startDate, endDate, body.memo);
        const result = await new CreateSiteCommandHandler(Factory.createSiteRepository(env), Factory.createWorkspaceRepository(env)).handle(command);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async updateSite(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const body = await request.json();

        const url = new URL(request.url);
        const workspaceId = parseInt(url.pathname.split('/')[2]);
        const siteId = parseInt(url.pathname.split('/')[4]);

        const startDate = new Date(body.startDate);
        const endDate = new Date(body.endDate);

        const command = new UpdateSiteCommand(workspaceId, userClaims.userId, siteId, body.companyId, body.name, body.location, startDate, endDate, body.memo);
        const result = await new UpdateSiteCommandHandler(Factory.createSiteRepository(env), Factory.createWorkspaceRepository(env)).handle(command);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async deleteSite(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const workspaceId = parseInt(url.pathname.split('/')[2]);
        const siteId = parseInt(url.pathname.split('/')[4]);

        const command = new DeleteSiteCommand(workspaceId, userClaims.userId, siteId);
        await new DeleteSiteCommandHandler(Factory.createSiteRepository(env), Factory.createWorkspaceRepository(env)).handle(command);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async createTalentPool(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const body = await request.json();

        const url = new URL(request.url);
        const workspaceId = parseInt(url.pathname.split('/')[2]);

        const birthday = new Date(body.birthday);

        const command = new CreateTalentPoolCommand(workspaceId, userClaims.userId, body.name, birthday, body.phone, body.address, body.memo);
        const result = await new CreateTalentPoolCommandHandler(Factory.createTalentPoolRepository(env), Factory.createWorkspaceRepository(env)).handle(command);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async updateTalentPool(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const body = await request.json();

        const url = new URL(request.url);
        const workspaceId = parseInt(url.pathname.split('/')[2]);
        const talentPoolId = parseInt(url.pathname.split('/')[4]);

        const birthday = new Date(body.birthday);

        const command = new UpdateTalentPoolCommand(workspaceId, userClaims.userId, talentPoolId, body.name, birthday, body.phone, body.address, body.memo);
        const result = await new UpdateTalentPoolCommandHandler(Factory.createTalentPoolRepository(env), Factory.createWorkspaceRepository(env)).handle(command);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async deleteTalentPool(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const workspaceId = parseInt(url.pathname.split('/')[2]);
        const talentPoolId = parseInt(url.pathname.split('/')[4]);

        const command = new DeleteTalentPoolCommand(userClaims.userId, workspaceId, talentPoolId);
        await new DeleteTalentPoolCommandHandler(Factory.createTalentPoolRepository(env), Factory.createWorkspaceRepository(env)).handle(command);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async createManySiteAttendances(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const body = await request.json();

        const url = new URL(request.url);
        const workspaceId = parseInt(url.pathname.split('/')[2]);
        const talentPoolId = parseInt(url.pathname.split('/')[4]);

        const siteAttendances = body.siteAttendances.map((siteAttendance: any) => ({
            siteId: siteAttendance.siteId,
            date: new Date(siteAttendance.date),
            startTime: new Date(siteAttendance.startTime),
            endTime: new Date(siteAttendance.endTime),
            amount: siteAttendance.amount
        }));

        const command = new CreateManySiteAttendancesCommand(workspaceId, userClaims.userId, talentPoolId, siteAttendances);
        const result = await new CreateManySiteAttendancesCommandHandler(Factory.createSiteAttendanceRepository(env), Factory.createWorkspaceRepository(env)).handle(command);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: corsHeaders
        });
    }

    static async upsertAndDeleteManySiteAttendances(request: Request, corsHeaders: Record<string, string>, userClaims: TokenClaims, env: Env): Promise<Response> {
        const body = await request.json();

        const url = new URL(request.url);
        const workspaceId = parseInt(url.pathname.split('/')[2]);
        const talentPoolId = parseInt(url.pathname.split('/')[4]);

        console.log(body.operations);

        const operations = {
            upsert: body.operations.upsert?.map((operation: any) => ({
                id: operation.id,
                siteId: operation.siteId,
                date: new Date(operation.date),
                startTime: new Date(operation.startTime),
                endTime: new Date(operation.endTime),
                amount: operation.amount
            })),
            delete: body.operations.delete
        };

        const command = new UpsertAndDeleteManySiteAttendancesCommand(workspaceId, userClaims.userId, talentPoolId, operations);
        const result = await new UpsertAndDeleteManySiteAttendancesCommandHandler(Factory.createSiteAttendanceRepository(env), Factory.createWorkspaceRepository(env)).handle(command);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: corsHeaders
        });
    }
}