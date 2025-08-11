import { ISiteAttendanceRepository } from "@/Repositories/Interfaces/ISiteAttendanceRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { CreateManySiteAttendancesCommand } from "@/Commands/CreateManySiteAttendancesCommand";
import { CreateManySiteAttendancesResponse } from "@/DTOs/CreateManySiteAttendancesResponse";

export class CreateManySiteAttendancesCommandHandler {
    constructor(private readonly siteAttendanceRepository: ISiteAttendanceRepository, private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(command: CreateManySiteAttendancesCommand): Promise<CreateManySiteAttendancesResponse> {
        const isMember = await this.workspaceRepository.existsMember(command.workspaceId, command.userId);

        if (!isMember) {
            throw new Error("워크스페이스 멤버가 아닙니다.");
        }

        const siteAttendances = await this.siteAttendanceRepository.addMany(command.talentPoolId, command.siteAttendances);
        return new CreateManySiteAttendancesResponse(siteAttendances);
    }
}
