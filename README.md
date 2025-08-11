# 노무닷컴 API Worker

Cloudflare Workers를 사용한 근로복지공단 API 프록시 서버입니다.

## 🚀 TypeScript 지원

이 프로젝트는 [Cloudflare Workers의 TypeScript 지원](https://developers.cloudflare.com/workers/languages/typescript/)을 활용하여 타입 안전성을 확보했습니다.

### 주요 개선사항

- **타입 안전성**: 모든 API 응답과 요청에 대한 타입 정의
- **인터페이스 정의**: 네이버 OAuth, 도로명주소 API, 사업자 정보 API 응답 타입
- **에러 처리**: 타입이 지정된 에러 응답 구조
- **개발 경험**: IntelliSense 지원으로 더 나은 개발 경험

## 📦 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 타입 생성

```bash
npm run generate-types
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 배포

```bash
# 스테이징 배포
npm run deploy:staging

# 프로덕션 배포
npm run deploy:production
```

## 🔧 환경 설정

### 환경 변수 설정

```bash
# 네이버 OAuth 시크릿 설정
wrangler secret put NAVER_CLIENT_SECRET

# 기타 환경 변수
wrangler secret put SERVICE_KEY
wrangler secret put JUSO_API_KEY
```

### wrangler.toml 설정

```toml
name = "nomubackend"
main = "worker.ts"
compatibility_date = "2024-01-01"

[env.production]
name = "nomubackend"

[env.staging]
name = "nomubackend-staging"

[env.development]
name = "nomubackend-dev"
```

## 📋 API 엔드포인트

### 헬스 체크
- **GET** `/health` - 서비스 상태 확인

### 사업자 정보 조회
- **GET** `/business?businessNumber={사업자번호}` - 사업자 정보 조회

### 도로명주소 검색
- **GET** `/juso-search?keyword={검색어}` - 도로명주소 검색

### 네이버 OAuth
- **GET** `/naver/login` - 네이버 로그인 URL 생성
- **GET** `/naver/callback?code={code}&state={state}` - 네이버 OAuth 콜백 처리

## 🛠️ 개발

### 타입 체크

```bash
npm run type-check
```

### 타입 생성

```bash
npm run generate-types
```

### 빌드 테스트

```bash
npm run build
```

## 📁 프로젝트 구조

```
backend/
├── worker.ts              # 메인 Worker 파일 (TypeScript)
├── wrangler.toml         # Wrangler 설정
├── tsconfig.json         # TypeScript 설정
├── package.json          # 프로젝트 의존성
└── README.md            # 프로젝트 문서
```

## 🔒 보안

- **환경 변수**: 민감한 정보는 `wrangler secret`으로 관리
- **CORS**: 적절한 CORS 헤더 설정
- **에러 처리**: 민감한 정보가 노출되지 않도록 에러 메시지 관리

## 🚀 배포

### 스테이징 환경

```bash
npm run deploy:staging
```

### 프로덕션 환경

```bash
npm run deploy:production
```

## 📚 참고 자료

- [Cloudflare Workers TypeScript 가이드](https://developers.cloudflare.com/workers/languages/typescript/)
- [Wrangler CLI 문서](https://developers.cloudflare.com/workers/wrangler/)
- [Workers 런타임 API](https://developers.cloudflare.com/workers/runtime-apis/) 