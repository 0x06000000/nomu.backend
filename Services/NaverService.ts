import { InternalServerErrorException } from "@/Exceptions/Exceptions";

export interface NaverConfiguration {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export interface GetAccessTokenRequest {
  code: string;
  state: string;
}

export interface GetAccessTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface GetUserInfoResponse {
  resultcode: string;
  message: string;
  response: {
    id: string;
    nickname: string;
    name: string;
    email: string;
    gender: string;
    age: string;
    birthday: string;
    profile_image: string;
    mobile: string;
  };
}

export class NaverService {
  private readonly naverConfig: NaverConfiguration;

  constructor(config: NaverConfiguration) {
    this.naverConfig = config;
  }

  async getAccessToken(request: GetAccessTokenRequest): Promise<GetAccessTokenResponse> {
    const formData = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.naverConfig.clientId,
      client_secret: this.naverConfig.clientSecret,
      code: request.code,
      state: request.state,
      redirect_uri: this.naverConfig.redirectUri
    });

    const response = await fetch('https://nid.naver.com/oauth2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    if (!response.ok) {
      throw new InternalServerErrorException(`액세스 토큰 요청 실패: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  async getUserInfo(accessToken: string): Promise<GetUserInfoResponse> {
    const response = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new InternalServerErrorException(`사용자 정보 요청 실패: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }
}
