import { D1Database } from '@cloudflare/workers-types';

export interface Env {
    JWT_SECRET: string;
    JWT_ISSUER: string;
    JWT_AUDIENCE: string;
    JUSO_API_KEY: string;
    JUSO_API_URL: string;
    NAVER_CLIENT_ID: string;
    NAVER_CLIENT_SECRET: string;
    NAVER_REDIRECT_URI: string;
    SERVICE_KEY: string;
    INDUSTRIAL_ACCIDENT_INSURANCE_PREMIUM_RATE_API_URL: string;
    DB: D1Database;
}