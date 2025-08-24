import { UpsertAndDeleteManySiteAttendancesCommand } from "@/Commands/UpsertAndDeleteManySiteAttendancesCommand";
import { UpsertAndDeleteManySiteAttendancesResponse } from "@/DTOs/UpsertAndDeleteManySiteAttendancesResponse";
import { ISiteAttendanceRepository } from "@/Repositories/Interfaces/ISiteAttendanceRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { ForbiddenException } from "@/Exceptions/Exceptions";

export class UpsertAndDeleteManySiteAttendancesCommandHandler {
    constructor(private readonly siteAttendanceRepository: ISiteAttendanceRepository, private readonly workspaceRepository: IWorkspaceRepository) {
    }

    async handle(command: UpsertAndDeleteManySiteAttendancesCommand): Promise<UpsertAndDeleteManySiteAttendancesResponse> {
        const isMember = await this.workspaceRepository.existsMember(command.workspaceId, command.userId);

        if (!isMember) {
            throw new ForbiddenException("워크스페이스 멤버가 아닙니다.");
        }

        const siteAttendances = await this.siteAttendanceRepository.processBatch(command.talentPoolId, command.operations);
        return new UpsertAndDeleteManySiteAttendancesResponse(siteAttendances);
    }
}   