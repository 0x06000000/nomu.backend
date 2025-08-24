import { CreateCompanyCommand } from "@/Commands/CreateCompanyCommand";
import { CreateCompanyResponse } from "@/DTOs/CreateCompanyResponse";
import { ICompanyRepository } from "@/Repositories/Interfaces/ICompanyRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { ForbiddenException } from "@/Exceptions/Exceptions";

export class CreateCompanyCommandHandler {
    constructor(private readonly companyRepository: ICompanyRepository, private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(command: CreateCompanyCommand): Promise<CreateCompanyResponse> {
        const isMember = await this.workspaceRepository.existsMember(command.workspaceId, command.createdBy);

        if (!isMember) {
            throw new ForbiddenException("워크스페이스 멤버가 아닙니다.");
        }

        const company = await this.companyRepository.add(command.workspaceId, command.name, command.location, command.employeeCount, command.createdBy, command.businessNumber, command.managementNumber);
        return new CreateCompanyResponse(company);
    }
}