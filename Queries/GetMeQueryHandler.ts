import { GetMeResponse } from "@/DTOs/GetMeResponse";
import { GetMeQuery } from "@/Queries/GetMeQuery";
import { IUserRepository } from "@/Repositories/Interfaces/IUserRepository";
import { NotFoundException } from "@/Exceptions/Exceptions";

export class GetMeQueryHandler {
    constructor(private readonly userRepository: IUserRepository) {
    }
    async handle(query: GetMeQuery): Promise<GetMeResponse> {
        const user = await this.userRepository.getById(query.userId);

        if (!user) {
            throw new NotFoundException("사용자를 찾을 수 없습니다.");
        }

        return new GetMeResponse(user);
    }
}