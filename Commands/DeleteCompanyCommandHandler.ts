import { ICompanyRepository } from "@/Repositories/Interfaces/ICompanyRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { DeleteCompanyCommand } from "./DeleteCompanyCommand";
import { ForbiddenException } from "@/Exceptions/Exceptions";

export class DeleteCompanyCommandHandler {
    constructor(private readonly companyRepository: ICompanyRepository, private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(command: DeleteCompanyCommand): Promise<void> {
        const isMember = await this.workspaceRepository.existsMember(command.workspaceId, command.userId);
        
        if (!isMember) {
            throw new ForbiddenException("워크스페이스 멤버가 아닙니다.");
        }

        await this.companyRepository.delete(command.id);
    }
}   