import { Env } from '@/common/Env';
import { NaverLoginCommand } from '@/Commands/NaverLoginCommand';
import { NaverService } from '@/Services/NaverService';
import { NaverLoginResponse } from '@/DTOs/NaverLoginResponse';
import { IUserRepository } from '@/Repositories/Interfaces/IUserRepository';
import { generateJwtToken } from '@/lib/jwt';
import { InternalServerErrorException, NotFoundException } from '@/Exceptions/Exceptions';
import { Buffer } from 'buffer';

export class NaverLoginCommandHandler {
    constructor(private readonly naverService: NaverService, private readonly userRepository: IUserRepository, private readonly env: Env) {
    }

    async handle(command: NaverLoginCommand): Promise<NaverLoginResponse> {
        try {
            const tokenResponse = await this.naverService.getAccessToken({
                code: command.code,
                state: command.state
            });

            const userInfo = await this.naverService.getUserInfo(tokenResponse.access_token);

            if (!userInfo.response) {
                throw new NotFoundException("네이버 사용자 정보를 찾지 못했습니다.");
            }

            const { email, name, birthday, mobile } = userInfo.response;

            let user = await this.userRepository.getByEmail(email);

            if (!user) {
                user = await this.userRepository.add(
                    email,
                    name,
                    birthday ? new Date(birthday) : undefined,
                    undefined,
                    mobile
                );
            }

            const accessToken = await generateJwtToken({
                userId: user.id,
                email: user.email,
                name: user.primaryProfile?.profile.name ?? ""
            }, this.env.JWT_SECRET, this.env.JWT_ISSUER, this.env.JWT_AUDIENCE);

            const redirectUrl = JSON.parse(atob(command.state)).redirectUrl;

            return new NaverLoginResponse(accessToken, user.id, user.primaryProfile?.profile.name ?? "", redirectUrl);

        } catch (error) {
            const message = "네이버 로그인 처리 중 오류가 발생했습니다.";
            console.error(message, error);
            throw new InternalServerErrorException(message);
        }
    }
}
