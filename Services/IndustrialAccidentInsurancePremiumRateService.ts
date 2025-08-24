import { InternalServerErrorException } from '@/Exceptions/Exceptions';
import { xml2json } from 'xml-js';

export interface IndustrialAccidentInsuranceConfiguration {
    apiKey: string;
    apiUrl: string;
}

interface CommonResponse {
    resultCode: string;
    resultMsg: string;
}

interface IndustryItem {
    resultCode: string;
    resultMag: string;
    jyFromDt: string;
    eopjongLevel1: string;      // 대분류명
    eopjongLevel1Cd: string;    // 대분류코드
    eopjongLevel2: string;      // 중분류명
    eopjongLevel2Cd: string;    // 중분류코드
    sjEopjongNm1: string;      // 업종분류명
    sjEopjongCd: string;       // 업종분류코드
    jyYoyul: string;           // 요율
}

interface ApiResponse {
    header: CommonResponse;
    body: {
        items: {
            item: IndustryItem[];
        }
    }
}

export class IndustrialAccidentInsurancePremiumRateService {
    private readonly config: IndustrialAccidentInsuranceConfiguration;

    constructor(config: IndustrialAccidentInsuranceConfiguration) {
        this.config = config;
    }

    async searchIndustryRates(pageNo: number, numOfRows: number): Promise<ApiResponse> {
        try {
            const apiUrl = new URL(this.config.apiUrl);
            // API 키를 URL 인코딩하지 않고 그대로 사용
            apiUrl.searchParams.set('serviceKey', this.config.apiKey);
            apiUrl.searchParams.set('pageNo', pageNo.toString());
            apiUrl.searchParams.set('numOfRows', numOfRows.toString());

            console.log('요청 URL:', apiUrl.toString());

            // fetch 옵션 추가
            const response = await fetch(apiUrl.toString(), {
                method: 'GET',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API 오류 응답:', errorText);
                throw new InternalServerErrorException(`산재보험료율 API 요청 실패: ${response.status} ${response.statusText}`);
            }

            const xmlText = await response.text();
            console.log('XML 응답:', xmlText);

            // XML이 비어있는지 확인
            if (!xmlText || xmlText.trim() === '') {
                throw new InternalServerErrorException('산재보험료율 API가 빈 응답을 반환했습니다');
            }

            const jsonData = JSON.parse(xml2json(xmlText, { compact: true, spaces: 2 }));
            console.log('변환된 JSON:', JSON.stringify(jsonData, null, 2));

            return jsonData.response as ApiResponse;
        } catch (error) {
            console.error('산재보험료율 검색 오류:', error);
            throw error;
        }
    }
}