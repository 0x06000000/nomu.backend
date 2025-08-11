import { verifyJwtToken, extractTokenFromHeader, TokenClaims } from './jwt';
import { Env } from '@/common/Env';

// JWT 토큰 검증 미들웨어
export async function authenticateToken(request: Request, env: Env): Promise<TokenClaims | null> {
  const authHeader = request.headers.get('Authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return null;
  }

  return await verifyJwtToken(token, env.JWT_SECRET, env.JWT_ISSUER, env.JWT_AUDIENCE);
}

// 인증이 필요한 라우트를 위한 헬퍼 함수
export function requireAuth(handler: (request: Request, env: any, ctx: any, user: TokenClaims) => Promise<Response>) {
  return async (request: Request, env: any, ctx: any): Promise<Response> => {
    const user = await authenticateToken(request, env);

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        error: '인증이 필요합니다.',
        details: '유효한 토큰이 필요합니다.'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      });
    }

    return handler(request, env, ctx, user);
  };
} 