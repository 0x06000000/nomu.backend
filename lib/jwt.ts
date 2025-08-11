import { SignJWT, jwtVerify } from 'jose';

export type TokenClaims = {
  userId: number;
  email: string;
  name: string;
}

// JWT 토큰 생성
export async function generateJwtToken(payload: {
  userId: number;
  email: string;
  name: string;
}, secret: string, issuer: string, audience: string): Promise<string> {
  const secretKey = new TextEncoder().encode(secret);
  
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime('24h') // 24시간 유효
    .sign(secretKey);
  
  return jwt;
}

// JWT 토큰 검증
export async function verifyJwtToken(token: string, secret: string, issuer: string, audience: string): Promise<TokenClaims | null> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey, {
      issuer: issuer,
      audience: audience,
    });
    
    return {
      userId: payload.userId as number,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

// Authorization 헤더에서 토큰 추출
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // 'Bearer ' 제거
} 