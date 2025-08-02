# Cloudflare Worker - 근로복지공단 API 캐싱 서버

이 Worker는 근로복지공단의 Open API 호출을 캐싱하여 API 사용량 제한을 우회하고 응답 속도를 개선합니다.

## 🚀 배포 방법

### 1. Cloudflare 계정 설정
1. [Cloudflare](https://cloudflare.com)에 가입
2. Workers & Pages 서비스 활성화

### 2. Wrangler CLI 설치
```bash
npm install -g wrangler
```

### 3. Cloudflare 로그인
```bash
wrangler login
```

### 4. Worker 배포
```bash
cd backend
wrangler deploy
```

배포 후 제공되는 URL을 메모해두세요 (예: `https://gyeongbuk-worker.your-subdomain.workers.dev`)

## 📋 API 사용법

### 사업자 정보 조회
```
GET /api/business?businessNumber=1234567890&opaBoheomFg=1&pageNo=1&numOfRows=10
```

#### 파라미터
- `businessNumber` (필수): 사업자등록번호
- `opaBoheomFg` (선택): 산재/고용 구분 (1: 산재, 2: 고용, 기본값: 1)
- `pageNo` (선택): 페이지 번호 (기본값: 1)
- `numOfRows` (선택): 목록 건수 (기본값: 10)

#### 응답 예시
```json
{
  "header": {
    "resultCode": "00",
    "resultMsg": "NORMAL SERVICE"
  },
  "items": [
    {
      "addr": "강원 원주시 우산공단길 10 (우산동)",
      "gyEopjongNm": "기타 가정용 전기기기 제조업",
      "opaBoheomFg": "2",
      "post": "26336",
      "saeopjangNm": "한일전기(주)",
      "sangsiInwonCnt": "271",
      "seongripDt": "19950701",
      "gyEopjongCd": "28519",
      "saeopjaDrno": "1234567890",
      "sjEopjongCd": "28519",
      "sjEopjongNm": "기타 가정용 전기기기 제조업",
      "saeopFg": "1"
    }
  ],
  "totalCount": 1,
  "cachedAt": "2024-01-15T10:30:00.000Z"
}
```

### 헬스 체크
```
GET /health
```

## 🔧 프론트엔드 연동

### 1. Worker URL 설정
`frontend/composables/useWorkerAPI.ts` 파일에서 `WORKER_URL`을 배포된 URL로 변경:

```typescript
const WORKER_URL = 'https://your-worker.your-subdomain.workers.dev'
```

### 2. Vue 컴포넌트에서 사용
```vue
<script setup>
import { useWorkerAPI } from '~/composables/useWorkerAPI'

const { 
  loading, 
  error, 
  data, 
  fetchBusinessInfo, 
  isCached,
  businessCount 
} = useWorkerAPI()

const businessNumber = ref('')

const searchBusiness = async () => {
  await fetchBusinessInfo({
    businessNumber: businessNumber.value,
    opaBoheomFg: '1', // 산재보험
    pageNo: 1,
    numOfRows: 10
  })
}
</script>

<template>
  <div>
    <input v-model="businessNumber" placeholder="사업자등록번호" />
    <button @click="searchBusiness" :disabled="loading">
      {{ loading ? '검색 중...' : '검색' }}
    </button>
    
    <div v-if="error" class="error">{{ error }}</div>
    
    <div v-if="data && data.items.length > 0">
      <p>총 {{ businessCount }}개 사업장</p>
      <p v-if="isCached">캐시된 데이터 ({{ new Date(data.cachedAt).toLocaleString() }})</p>
      
      <div v-for="item in data.items" :key="item.saeopjaDrno">
        <h3>{{ item.saeopjangNm }}</h3>
        <p>주소: {{ item.addr }}</p>
        <p>산재업종: {{ item.sjEopjongNm }}</p>
        <p>상시인원: {{ item.sangsiInwonCnt }}명</p>
      </div>
    </div>
  </div>
</template>
```

## ⚙️ 캐시 설정

- **캐시 TTL**: 24시간 (86400초)
- **캐시 키**: `business:{사업자번호}:{보험구분}:{페이지}:{건수}`
- **캐시 히트 헤더**: `X-Cache: HIT/MISS`

## 🔍 모니터링

### 로그 확인
Cloudflare Dashboard에서 Worker 로그를 확인할 수 있습니다:
1. Cloudflare Dashboard → Workers & Pages
2. 해당 Worker 선택
3. Logs 탭에서 실시간 로그 확인

### 성능 지표
- 요청 수
- 캐시 히트율
- 응답 시간
- 오류율

## 🛠️ 개발 및 테스트

### 로컬 개발
```bash
wrangler dev
```

### 테스트
```bash
# 사업자 정보 조회 테스트
curl "https://your-worker.your-subdomain.workers.dev/api/business?businessNumber=1234567890"

# 헬스 체크 테스트
curl "https://your-worker.your-subdomain.workers.dev/health"
```

## 📊 무료 플랜 제한

Cloudflare Workers 무료 플랜:
- **일일 요청 수**: 100,000개
- **CPU 시간**: 10ms/요청
- **메모리**: 128MB
- **스크립트 크기**: 1MB

## 🔒 보안 고려사항

1. **API 키 보호**: Worker 내부에서만 API 키 사용
2. **CORS 설정**: 필요한 도메인만 허용
3. **요청 제한**: 필요시 rate limiting 추가
4. **에러 처리**: 민감한 정보 노출 방지

## 🚨 문제 해결

### 일반적인 오류
1. **API 키 오류**: 인증키 확인
2. **CORS 오류**: 프론트엔드 도메인 확인
3. **캐시 미스**: 첫 요청 시 정상
4. **타임아웃**: API 응답 지연 시

### 디버깅
```bash
# Worker 로그 확인
wrangler tail

# 환경 변수 확인
wrangler secret list
```

## 📝 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 