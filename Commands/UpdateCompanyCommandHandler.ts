import { UpdateCompanyCommand } from "@/Commands/UpdateCompanyCommand";
import { UpdateCompanyResponse } from "@/DTOs/UpdateCompanyResponse";
import { ICompanyRepository } from "@/Repositories/Interfaces/ICompanyRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";

export class UpdateCompanyCommandHandler {
    constructor(private readonly companyRepository: ICompanyRepository, private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(command: UpdateCompanyCommand): Promise<UpdateCompanyResponse> {
        const isMember = await this.workspaceRepository.existsMember(command.workspaceId, command.userId);

        if (!isMember) {
            throw new Error("워크스페이스 멤버가 아닙니다.");
        }

        const company = await this.companyRepository.update(command.id, command.name, command.location, command.employeeCount, command.businessNumber, command.managementNumber);
        return new UpdateCompanyResponse(company);
    }
}