import { Router, cors } from 'itty-router';
import { Env } from './common/Env';
import { requireAuth } from './lib/auth';
import { JusoService } from './Services/JusoService';
import { NaverLoginController } from './Controllers/NaverLoginController';
import { TokenClaims } from './lib/jwt';
import { WorkspaceController } from './Controllers/WorkspaceController';
import { IndustrialAccidentInsurancePremiumRateController } from './Controllers/IndustrialAccidentInsurancePremiumRateController';
import { BadRequestException, ConflictException, ForbiddenException, InternalServerErrorException, NotFoundException, UnauthorizedException, ValidationException } from './Exceptions/Exceptions';

const { preflight, corsify } = cors();

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json'
};

// 라우터 생성
const router = Router({
  before: [preflight],
  finally: [corsify],
  catch: (error: Error) => {
    let status = 500;

    if (error instanceof BadRequestException || error instanceof ValidationException) {
      status = 400;
    }

    if (error instanceof UnauthorizedException) {
      status = 401;
    }

    if (error instanceof ForbiddenException) {
      status = 403;
    }

    if (error instanceof NotFoundException) {
      status = 404;
    }

    if (error instanceof ConflictException) {
      status = 409;
    }

    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), { status: status, headers });
  }
});

// Health check
router.get('/health', (request: Request, env: Env, ctx: any) => {
  return new Response(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }), {
    status: 200,
    headers
  });
});

router.post('/industrial-accident-insurance-premium-rate', async (request: Request, env: Env, ctx: any) => {
  return IndustrialAccidentInsurancePremiumRateController.upsertIndustrialAccidentInsurancePremiumRate(request, headers, env);
});

router.get('/industrial-accident-insurance-premium-rate/first-levels', async (request: Request, env: Env, ctx: any) => {
  return IndustrialAccidentInsurancePremiumRateController.getFirstLevels(request, headers, env);
});

router.get('/industrial-accident-insurance-premium-rate/second-levels', async (request: Request, env: Env, ctx: any) => {
  return IndustrialAccidentInsurancePremiumRateController.getSecondLevels(request, headers, env);
});

router.get('/industrial-accident-insurance-premium-rate/industries', async (request: Request, env: Env, ctx: any) => {
  return IndustrialAccidentInsurancePremiumRateController.getIndustries(request, headers, env);
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
    headers
  });
});

// Naver OAuth
router.get('/naver/login', async (request: Request, env: Env, ctx: any) => {
  return NaverLoginController.login(headers, env);
});

router.get('/naver/callback', async (request: Request, env: Env, ctx: any) => {
  const url = new URL(request.url);

  return NaverLoginController.callback(url, headers, env);
});

router.get('/workspaces', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.getWorkspaces(request, headers, userClaims, env);
}));

router.get('/workspaces/:workspaceId/is-member', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.isMemberOfWorkspace(request, headers, userClaims, env);
}));

router.get('/workspaces/:workspaceId/companies', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.getCompanies(request, headers, userClaims, env);
}));

router.get('/workspaces/:workspaceId/sites', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.getSites(request, headers, userClaims, env);
}));

router.get('/workspaces/:workspaceId/talent-pools', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.getTalentPools(request, headers, userClaims, env);
}));

router.get('/workspaces/:workspaceId/talent-pools/:talentPoolId/attendances', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.getSiteAttendancesByTalentPoolId(request, headers, userClaims, env);
}));

router.post('/workspaces', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.create(request, headers, userClaims, env);
}));

router.put('/workspaces/:workspaceId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.update(request, headers, userClaims, env);
}));

router.delete('/workspaces/:workspaceId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.delete(request, headers, userClaims, env);
}));

router.post('/workspaces/:workspaceId/companies', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.createCompany(request, headers, userClaims, env);
}));

router.put('/workspaces/:workspaceId/companies/:companyId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.updateCompany(request, headers, userClaims, env);
}));

router.delete('/workspaces/:workspaceId/companies/:companyId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.deleteCompany(request, headers, userClaims, env);
}));

router.post('/workspaces/:workspaceId/sites', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.createSite(request, headers, userClaims, env);
}));

router.put('/workspaces/:workspaceId/sites/:siteId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.updateSite(request, headers, userClaims, env);
}));

router.delete('/workspaces/:workspaceId/sites/:siteId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.deleteSite(request, headers, userClaims, env);
}));

router.post('/workspaces/:workspaceId/talent-pools', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.createTalentPool(request, headers, userClaims, env);
}));

router.put('/workspaces/:workspaceId/talent-pools/:talentPoolId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.updateTalentPool(request, headers, userClaims, env);
}));

router.delete('/workspaces/:workspaceId/talent-pools/:talentPoolId', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.deleteTalentPool(request, headers, userClaims, env);
}));

router.post('/workspaces/:workspaceId/talent-pools/:talentPoolId/attendances', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.createManySiteAttendances(request, headers, userClaims, env);
}));

router.put('/workspaces/:workspaceId/talent-pools/:talentPoolId/attendances', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.upsertAndDeleteManySiteAttendances(request, headers, userClaims, env);
}));

router.get('/me', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.getMe(request, headers, userClaims, env);
}));

router.get('/workspaces/:workspaceId/pay-stubs', requireAuth(async (request: Request, env: Env, ctx: any, userClaims: TokenClaims) => {
  return WorkspaceController.getPayStubs(request, headers, userClaims, env);
}));

router.all('*', () => {
  return new Response(JSON.stringify({
    success: false,
    error: 'Not found',
    message: '찾을 수 없습니다.'
  }), {
    status: 404,
    headers
  });
});

export default router;
