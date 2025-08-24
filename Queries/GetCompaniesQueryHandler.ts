import { GetCompaniesResponse } from "@/DTOs/GetCompaniesResponse";
import { GetCompaniesQuery } from "@/Queries/GetCompaniesQuery";
import { ICompanyRepository } from "@/Repositories/Interfaces/ICompanyRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { ForbiddenException } from "@/Exceptions/Exceptions";

export class GetCompaniesQueryHandler {
    constructor(private readonly companyRepository: ICompanyRepository, private readonly workspaceRepository: IWorkspaceRepository) {
    }
    async handle(command: GetCompaniesQuery): Promise<GetCompaniesResponse> {
        const isMember = await this.workspaceRepository.existsMember(command.workspaceId, command.userId);

        if (!isMember) {
            throw new ForbiddenException("워크스페이스 멤버가 아닙니다.");
        }

        const companies = await this.companyRepository.getByWorkspaceId(command.workspaceId);
        return new GetCompaniesResponse(companies);
    }
}