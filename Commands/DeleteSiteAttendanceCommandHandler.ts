import { ISiteAttendanceRepository } from "@/Repositories/Interfaces/ISiteAttendanceRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { DeleteSiteAttendanceCommand } from "./DeleteSiteAttendanceCommand";

export class DeleteSiteAttendanceCommandHandler {
    constructor(private readonly siteAttendanceRepository: ISiteAttendanceRepository, private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(command: DeleteSiteAttendanceCommand): Promise<void> {
        const isMember = await this.workspaceRepository.existsMember(command.workspaceId, command.userId);

        if (!isMember) {
            throw new Error("워크스페이스 멤버가 아닙니다.");
        }

        await this.siteAttendanceRepository.delete(command.id);
    }
}   