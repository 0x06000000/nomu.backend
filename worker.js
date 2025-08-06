// Cloudflare Worker for 근로복지공단 API proxy
// Simple proxy to call the 근로복지공단 API

const API_BASE_URL = 'https://apis.data.go.kr/B490001/gySjbPstateInfoService';
const 사업장장조회_API_URL = `${API_BASE_URL}/getGySjBoheomBsshItem`;
const SERVICE_KEY = 'iaxjwmL9Hxpw3MSZ6XSYR0wcx1bWX0+18BmyAuILHPob+Qjn/F+Vt3sez2SsejjveYC0Ck+4EsAENKZ6JB2jTA==';

// 도로명주소 API 설정
const JUSO_API_KEY = 'U01TX0FVVEgyMDI1MDgwMzAyNDUwOTExNjAxNTg=';
const JUSO_API_URL = 'https://business.juso.go.kr/addrlink/addrLinkApiJsonp.do';

// 네이버 OAuth 설정
const NAVER_CLIENT_ID = 'iG_coo1OuyZewmYWIxgO'; // 실제 클라이언트 ID로 변경 필요
const NAVER_CLIENT_SECRET = 'ZF4vuQd7JA'; // 실제 클라이언트 시크릿으로 변경 필요
const NAVER_REDIRECT_URI = 'http://localhost:3000/auth/naver-callback'; // 실제 리다이렉트 URI로 변경 필요

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json;charset=UTF-8'
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: corsHeaders
        });
    }

    // Only handle GET requests
    if (request.method !== 'GET') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: corsHeaders
        });
    }

    // Route handling
    if (path === '/health') {
        return handleHealthCheck();
    }

    if (path === '/business') {
        return handleBusinessAPI(url, corsHeaders);
    }

    if (path === '/juso-search') {
        return handleJusoSearchAPI(url, corsHeaders);
    }

    if (path === '/naver/login') {
        return handleNaverLogin(url, corsHeaders);
    }

    if (path === '/naver/callback') {
        return handleNaverCallback(url, corsHeaders);
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({
        error: 'Not found',
        availableEndpoints: ['/health', '/business', '/juso-search', '/naver/login', '/naver/callback']
    }), {
        status: 404,
        headers: corsHeaders
    });
}

async function handleBusinessAPI(url, corsHeaders) {
    try {
        // Extract parameters from the request
        const searchParams = url.searchParams;
        const businessNumber = searchParams.get('businessNumber');
        const pageNo = searchParams.get('pageNo') || '1';
        const numOfRows = searchParams.get('numOfRows') || '10';
        const opaBoheomFg = searchParams.get('opaBoheomFg') || '1'; // 1: 산재, 2: 고용

        if (!businessNumber) {
            return new Response(JSON.stringify({
                error: '사업자등록번호(businessNumber)는 필수입니다.'
            }), {
                status: 400,
                headers: corsHeaders
            });
        }

        // Build API URL
        const apiUrl = new URL(사업장장조회_API_URL);
        // URL 인코딩된 serviceKey 사용
        apiUrl.searchParams.set('serviceKey', SERVICE_KEY);
        apiUrl.searchParams.set('v_saeopjaDrno', businessNumber);
        apiUrl.searchParams.set('opaBoheomFg', opaBoheomFg);
        apiUrl.searchParams.set('pageNo', pageNo);
        apiUrl.searchParams.set('numOfRows', numOfRows);

        // Fetch from API with headers
        const apiResponse = await fetch(apiUrl.toString(), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        
        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('API Error Response:', errorText);
            throw new Error(`API request failed: ${apiResponse.status} ${apiResponse.statusText} - ${errorText}`);
        }

        const apiData = await apiResponse.text();

        // Parse XML response and convert to JSON
        const jsonData = await convertXmlToJson(apiData);

        // Create response
        const response = new Response(JSON.stringify(jsonData), {
            status: 200,
            headers: corsHeaders
        });

        return response;

    } catch (error) {
        console.error('Worker error:', error);

        return new Response(JSON.stringify({
            error: '서버 오류가 발생했습니다.',
            details: error.message
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// Advanced XML to JSON parser for the API response
function convertXmlToJson(xmlString) {
  const jsonData = {};
  for (const result of xmlString.matchAll(/(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm)) {
    const key = result[1] || result[3];
    const value = result[2] && convertXmlToJson(result[2]);
    jsonData[key] = ((value && Object.keys(value).length) ? value : result[2]) || null;
  }
  return jsonData;
}

// 도로명주소 API 핸들러
async function handleJusoSearchAPI(url, corsHeaders) {
    try {
        // Extract parameters from the request
        const searchParams = url.searchParams;
        const keyword = searchParams.get('keyword');
        const currentPage = searchParams.get('currentPage') || '1';
        const countPerPage = searchParams.get('countPerPage') || '10';

        if (!keyword) {
            return new Response(JSON.stringify({
                error: '검색어(keyword)는 필수입니다.'
            }), {
                status: 400,
                headers: corsHeaders
            });
        }

        // Build Juso API URL with parameters
        const apiUrl = new URL(JUSO_API_URL);
        apiUrl.searchParams.set('currentPage', currentPage);
        apiUrl.searchParams.set('countPerPage', countPerPage);
        apiUrl.searchParams.set('resultType', 'json');
        apiUrl.searchParams.set('confmKey', JUSO_API_KEY);
        apiUrl.searchParams.set('keyword', keyword);

        // Fetch from Juso API
        const apiResponse = await fetch(apiUrl.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log(apiResponse);
        
        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('Juso API Error Response:', errorText);
            throw new Error(`Juso API request failed: ${apiResponse.status} ${apiResponse.statusText} - ${errorText}`);
        }

        const apiDataText = await apiResponse.text();
        console.log('Juso API Raw Response:', apiDataText);
        
        // JSONP 응답을 JSON으로 변환
        let apiData;
        try {
            // JSONP 응답에서 JSON 부분만 추출 (callback(...) 형태에서 ... 부분만)
            const jsonMatch = apiDataText.match(/^[^(]*\((.+)\)$/);
            if (jsonMatch) {
                apiData = JSON.parse(jsonMatch[1]);
            } else {
                // 일반 JSON 응답인 경우
                apiData = JSON.parse(apiDataText);
            }
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            throw new Error(`JSON 파싱 실패: ${parseError.message}`);
        }
        
        // 디버깅을 위한 로깅
        console.log('Juso API Parsed Response:', JSON.stringify(apiData, null, 2));

        // Create response
        const response = new Response(JSON.stringify(apiData), {
            status: 200,
            headers: corsHeaders
        });

        return response;

    } catch (error) {
        console.error('Juso Search Worker error:', error);

        return new Response(JSON.stringify({
            error: '도로명주소 검색 중 오류가 발생했습니다.',
            details: error.message
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// 네이버 로그인 URL 생성
async function handleNaverLogin(url, corsHeaders) {
    try {
        const state = generateRandomState();
        const loginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(NAVER_REDIRECT_URI)}&state=${state}`;

        return new Response(JSON.stringify({
            loginUrl: loginUrl,
            state: state
        }), {
            status: 200,
            headers: corsHeaders
        });

    } catch (error) {
        console.error('Naver Login error:', error);

        return new Response(JSON.stringify({
            error: '네이버 로그인 URL 생성 중 오류가 발생했습니다.',
            details: error.message
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// 네이버 콜백 처리
async function handleNaverCallback(url, corsHeaders) {
    try {
        const searchParams = url.searchParams;
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
            return new Response(JSON.stringify({
                error: '네이버 로그인 실패',
                details: error
            }), {
                status: 400,
                headers: corsHeaders
            });
        }

        if (!code || !state) {
            return new Response(JSON.stringify({
                error: '필수 파라미터가 누락되었습니다.',
                required: ['code', 'state']
            }), {
                status: 400,
                headers: corsHeaders
            });
        }

        // 액세스 토큰 요청
        const tokenResponse = await fetch('https://nid.naver.com/oauth2.0/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: NAVER_CLIENT_ID,
                client_secret: NAVER_CLIENT_SECRET,
                code: code,
                state: state
            })
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Naver Token API Error:', errorText);
            throw new Error(`토큰 요청 실패: ${tokenResponse.status} ${tokenResponse.statusText}`);
        }

        const tokenData = await tokenResponse.json();

        // 사용자 정보 요청
        const userInfoResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`
            }
        });

        if (!userInfoResponse.ok) {
            const errorText = await userInfoResponse.text();
            console.error('Naver User Info API Error:', errorText);
            throw new Error(`사용자 정보 요청 실패: ${userInfoResponse.status} ${userInfoResponse.statusText}`);
        }

        const userInfo = await userInfoResponse.json();

        // 응답 데이터 구성
        const responseData = {
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            tokenType: tokenData.token_type,
            expiresIn: tokenData.expires_in,
            userInfo: userInfo.response,
            state: state
        };

        // 쿠키 설정을 위한 응답 헤더 추가
        const responseHeaders = {
            ...corsHeaders,
            'Set-Cookie': `access_token=${tokenData.access_token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
        };

        return new Response(JSON.stringify(responseData), {
            status: 200,
            headers: responseHeaders
        });

    } catch (error) {
        console.error('Naver Callback error:', error);

        return new Response(JSON.stringify({
            error: '네이버 로그인 콜백 처리 중 오류가 발생했습니다.',
            details: error.message
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}

// 랜덤 state 생성
function generateRandomState() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Health check endpoint
async function handleHealthCheck() {
    return new Response(JSON.stringify({
        status: 'healthy',
        service: '근로복지공단 API Proxy Worker',
        timestamp: new Date().toISOString(),
        endpoints: {
            '/business': '사업자 정보 조회 (GET)',
            '/juso-search': '도로명주소 검색 (GET)',
            '/naver/login': '네이버 로그인 URL 생성 (GET)',
            '/naver/callback': '네이버 로그인 콜백 처리 (GET)',
            '/health': '헬스 체크 (GET)'
        },
        parameters: {
            businessNumber: '사업자등록번호 (필수)',
            opaBoheomFg: '산재/고용 구분 (1: 산재, 2: 고용)',
            pageNo: '페이지 번호',
            numOfRows: '목록 건수',
            keyword: '검색어 (필수)',
            currentPage: '현재 페이지 (기본값: 1)',
            countPerPage: '페이지당 결과 수 (기본값: 10)'
        },
        naverOAuth: {
            loginUrl: '/naver/login',
            callbackUrl: '/naver/callback',
            description: '네이버 OAuth 2.0 인증 플로우'
        }
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
} 