import { NaverLoginCommand } from "@/Commands/NaverLoginCommand";
import { NaverLoginCommandHandler } from "@/Commands/NaverLoginCommandHandler";
import { Env } from "@/common/Env";
import { Factory } from "@/lib/factory";

export class NaverLoginController {
  static async login(corsHeaders: Record<string, string>, env: Env): Promise<Response> {
    const loginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${env.NAVER_CLIENT_ID}&redirect_uri=${env.NAVER_REDIRECT_URI}`;

    const responseData = {
      loginUrl,
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: corsHeaders
    });
  }

  static async callback(url: URL, corsHeaders: Record<string, string>, env: Env): Promise<Response> {
    const naverLoginCommandHandler = new NaverLoginCommandHandler(Factory.createNaverService(env), Factory.createUserRepository(env), env);

    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code || !state) {
      return new Response(JSON.stringify({ error: '잘못된 요청입니다.' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const command = new NaverLoginCommand(code, state);
    const result = await naverLoginCommandHandler.handle(command);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: corsHeaders
    });
  }
}