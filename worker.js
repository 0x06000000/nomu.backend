// Cloudflare Worker for 근로복지공단 API proxy
// Simple proxy to call the 근로복지공단 API

const API_BASE_URL = 'https://apis.data.go.kr/B490001/gySjbPstateInfoService';
const SERVICE_KEY = 'iaxjwmL9Hxpw3MSZ6XSYR0wcx1bWX0+18BmyAuILHPob+Qjn/F+Vt3sez2SsejjveYC0Ck+4EsAENKZ6JB2jTA==';

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

  if (path === '/api/business') {
    return handleBusinessAPI(url, corsHeaders);
  }

  // 404 for unknown routes
  return new Response(JSON.stringify({ 
    error: 'Not found',
    availableEndpoints: ['/health', '/api/business']
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
    const apiUrl = new URL(API_BASE_URL);
    apiUrl.searchParams.set('serviceKey', SERVICE_KEY);
    apiUrl.searchParams.set('getSaeopJongryuSearchSrvc', '');
    apiUrl.searchParams.set('v_saeopjaDrno', businessNumber);
    apiUrl.searchParams.set('opaBoheomFg', opaBoheomFg);
    apiUrl.searchParams.set('pageNo', pageNo);
    apiUrl.searchParams.set('numOfRows', numOfRows);

    // Fetch from API
    const apiResponse = await fetch(apiUrl.toString());
    
    if (!apiResponse.ok) {
      throw new Error(`API request failed: ${apiResponse.status} ${apiResponse.statusText}`);
    }

    const apiData = await apiResponse.text();
    
    // Parse XML response and convert to JSON
    const jsonData = await parseXMLResponse(apiData);
    
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

// Simple XML to JSON parser for the API response
async function parseXMLResponse(xmlString) {
  try {
    // Extract the response body from XML
    const responseMatch = xmlString.match(/<responseBody>(.*?)<\/responseBody>/s);
    if (!responseMatch) {
      throw new Error('Invalid XML response format');
    }

    const responseBody = responseMatch[1];
    
    // Parse items
    const items = [];
    const itemRegex = /<item>(.*?)<\/item>/gs;
    let itemMatch;
    
    while ((itemMatch = itemRegex.exec(responseBody)) !== null) {
      const itemXml = itemMatch[1];
      const item = {};
      
      // Extract all fields from the item
      const fieldRegex = /<([^>]+)>([^<]*)<\/\1>/g;
      let fieldMatch;
      
      while ((fieldMatch = fieldRegex.exec(itemXml)) !== null) {
        const fieldName = fieldMatch[1];
        const fieldValue = fieldMatch[2];
        item[fieldName] = fieldValue;
      }
      
      items.push(item);
    }

    // Extract header information
    const headerMatch = responseBody.match(/<header>(.*?)<\/header>/s);
    let header = {};
    if (headerMatch) {
      const headerXml = headerMatch[1];
      const fieldRegex = /<([^>]+)>([^<]*)<\/\1>/g;
      let fieldMatch;
      
      while ((fieldMatch = fieldRegex.exec(headerXml)) !== null) {
        const fieldName = fieldMatch[1];
        const fieldValue = fieldMatch[2];
        header[fieldName] = fieldValue;
      }
    }

    return {
      header,
      items,
      totalCount: items.length,
      cachedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('XML parsing error:', error);
    return {
      error: 'XML 파싱 오류',
      originalResponse: xmlString,
      details: error.message
    };
  }
}

// Health check endpoint
async function handleHealthCheck() {
  return new Response(JSON.stringify({
    status: 'healthy',
    service: '근로복지공단 API Proxy Worker',
    timestamp: new Date().toISOString(),
    endpoints: {
      '/api/business': '사업자 정보 조회 (GET)',
      '/health': '헬스 체크 (GET)'
    },
    parameters: {
      businessNumber: '사업자등록번호 (필수)',
      opaBoheomFg: '산재/고용 구분 (1: 산재, 2: 고용)',
      pageNo: '페이지 번호',
      numOfRows: '목록 건수'
    }
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
} 