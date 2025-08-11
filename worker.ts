import { Router, cors } from 'itty-router';
import { Env } from './common/Env';
import { requireAuth } from './lib/auth';
import { JusoService } from './Services/JusoService';
import { NaverLoginController } from './Controllers/NaverLoginController';
import { TokenClaims } from './lib/jwt';
import { WorkspaceController } from './Controllers/WorkspaceController';
import { IndustrialAccidentInsurancePremiumRateController } from './Controllers/IndustrialAccidentInsurancePremiumRateController';

const { preflight } = cors();

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
};

// 라우터 생성
const router = Router({ before: [preflight] });

// Health check
router.get('/health', (request: Request, env: Env, ctx: any) => {
  return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
    status: 200,
    headers: corsHeaders
  });
});

router.get('/industrial-accident-insurance-premium-rate', async (request: Request, env: Env, ctx: any) => {
  return IndustrialAccidentInsurancePremiumRateController.searchIndustryRates(request, env);
});

router.get('/juso-search', async (request: Request, env: Env, ctx: any) => {
  const jusoService = new JusoService({
    apiKey: env.JUSO_API_KEY,
    apiUrl: env.JUSO_API_URL
  });

  const url = new URL(request.url);

  const result = await jusoService.searchAddress({
    keyword: url.searchParams.get('keyword') ?? '',
    currentPage: url.searchParams.get('currentPage') ?? '1',
    countPerPage: url.searchParams.get('countPerPage') ?? '10',
  });

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: corsHeaders
  });
});

// Naver OAuth
router.get('/naver/login', async (request: Request, env: Env, ctx: any) => {
  return NaverLoginController.login(corsHeaders, env);
});

router.get('/naver/callback', async (request: Request, env: Env, ctx: any) => {
  const url = new URL(request.url);

  return NaverLoginController.callback(url, corsHeaders, env);
});

router.get('/workspaces', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.getWorkspaces(request, corsHeaders, userClaims, env);
}));

router.get('/workspaces/:workspaceId/companies', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.getCompanies(request, corsHeaders, userClaims, env);
}));

router.get('/workspaces/:workspaceId/sites', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.getSites(request, corsHeaders, userClaims, env);
}));

router.get('/workspaces/:workspaceId/talent-pools', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.getTalentPools(request, corsHeaders, userClaims, env);
}));

router.get('/workspaces/:workspaceId/talent-pools/:talentPoolId/attendances', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.getSiteAttendancesByTalentPoolId(request, corsHeaders, userClaims, env);
}));

router.post('/workspaces', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.create(request, corsHeaders, userClaims, env);
}));

router.put('/workspaces/:workspaceId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.update(request, corsHeaders, userClaims, env);
}));

router.delete('/workspaces/:workspaceId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.delete(request, corsHeaders, userClaims, env);
}));

router.post('/workspaces/:workspaceId/companies', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.createCompany(request, corsHeaders, userClaims, env);
}));

router.put('/workspaces/:workspaceId/companies/:companyId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.updateCompany(request, corsHeaders, userClaims, env);
}));

router.delete('/workspaces/:workspaceId/companies/:companyId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.deleteCompany(request, corsHeaders, userClaims, env);
}));

router.post('/workspaces/:workspaceId/sites', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.createSite(request, corsHeaders, userClaims, env);
}));

router.put('/workspaces/:workspaceId/sites/:siteId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.updateSite(request, corsHeaders, userClaims, env);
}));

router.delete('/workspaces/:workspaceId/sites/:siteId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.deleteSite(request, corsHeaders, userClaims, env);
}));

router.post('/workspaces/:workspaceId/talent-pools', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.createTalentPool(request, corsHeaders, userClaims, env);
}));

router.put('/workspaces/:workspaceId/talent-pools/:talentPoolId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.updateTalentPool(request, corsHeaders, userClaims, env);
}));

router.delete('/workspaces/:workspaceId/talent-pools/:talentPoolId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.deleteTalentPool(request, corsHeaders, userClaims, env);
}));

router.post('/workspaces/:workspaceId/talent-pools/:talentPoolId/attendances', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.createManySiteAttendances(request, corsHeaders, userClaims, env);
}));

router.put('/workspaces/:workspaceId/talent-pools/:talentPoolId/attendances', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.upsertAndDeleteManySiteAttendances(request, corsHeaders, userClaims, env);
}));

// 404 handler
router.all('*', () => {
  return new Response(JSON.stringify({
    success: false,
    error: 'Not found',
    message: '찾을 수 없습니다.'
  }), {
    status: 404,
    headers: corsHeaders
  });
});

export default router;
