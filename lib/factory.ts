import { Env } from "@/common/Env";
import { NaverService } from "@/Services/NaverService";
import { IUserRepository } from "@/Repositories/Interfaces/IUserRepository";
import { UserRepository } from "@/Repositories/Implementations/UserRepository";
import { IWorkspaceRepository } from "@/Repositories/Interfaces/IWorkspaceRepository";
import { WorkspaceRepository } from "@/Repositories/Implementations/WorkspaceRepository";
import { ITalentPoolRepository } from "@/Repositories/Interfaces/ITalentPoolRepository";
import { TalentPoolRepository } from "@/Repositories/Implementations/TalentPoolRepository";
import { ICompanyRepository } from "@/Repositories/Interfaces/ICompanyRepository";
import { CompanyRepository } from "@/Repositories/Implementations/CompanyRepository";
import { ISiteRepository } from "@/Repositories/Interfaces/ISiteRepository";
import { SiteRepository } from "@/Repositories/Implementations/SiteRepository";
import { ISiteAttendanceRepository } from "@/Repositories/Interfaces/ISiteAttendanceRepository";
import { SiteAttendanceRepository } from "@/Repositories/Implementations/SiteAttendanceRepository";
import { IMemberRepository } from "@/Repositories/Interfaces/IMemberRepository";
import { MemberRepository } from "@/Repositories/Implementations/MemberRepository";
import { IProfileRepository } from "@/Repositories/Interfaces/IProfileRepository";
import { ProfileRepository } from "@/Repositories/Implementations/ProfileRepository";
import { JusoService } from "@/Services/JusoService";

export class Factory {
    static createNaverService(env: Env): NaverService {
        return new NaverService({
            clientId: env.NAVER_CLIENT_ID,
            clientSecret: env.NAVER_CLIENT_SECRET,
            redirectUri: env.NAVER_REDIRECT_URI
        });
    }

    static createJusoService(env: Env): JusoService {
        return new JusoService({
            apiKey: env.JUSO_API_KEY,
            apiUrl: env.JUSO_API_URL
        });
    }

    static createUserRepository(env: Env): IUserRepository {
        return new UserRepository(env.DB);
    }

    static createWorkspaceRepository(env: Env): IWorkspaceRepository {
        return new WorkspaceRepository(env.DB);
    }

    static createTalentPoolRepository(env: Env): ITalentPoolRepository {
        return new TalentPoolRepository(env.DB);
    }

    static createCompanyRepository(env: Env): ICompanyRepository {
        return new CompanyRepository(env.DB);
    }

    static createSiteRepository(env: Env): ISiteRepository {
        return new SiteRepository(env.DB);
    }

    static createSiteAttendanceRepository(env: Env): ISiteAttendanceRepository {
        return new SiteAttendanceRepository(env.DB);
    }

    static createMemberRepository(env: Env): IMemberRepository {
        return new MemberRepository(env.DB);
    }

    static createProfileRepository(env: Env): IProfileRepository {
        return new ProfileRepository(env.DB);
    }
}