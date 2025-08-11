export interface JusoConfiguration {
  apiKey: string;
  apiUrl: string;
}

export interface JusoSearchRequest {
  keyword: string;
  currentPage?: string;
  countPerPage?: string;
}

export interface JusoCommonResponse {
  common: {
    totalCount: string;
    currentPage: string;
    countPerPage: string;
    errorCode: string;
    errorMessage: string;
  };
}

export interface JusoAddressData {
  roadAddr: string;         // 전체 도로명주소
  roadAddrPart1: string;    // 도로명주소(참고항목 제외)
  roadAddrPart2: string;    // 도로명주소 참고항목
  jibunAddr: string;        // 지번주소
  engAddr: string;          // 도로명주소(영문)
  zipNo: string;           // 우편번호
  admCd: string;           // 행정구역코드
  rnMgtSn: string;         // 도로명코드
  bdMgtSn: string;         // 건물관리번호
  detBdNmList: string;     // 상세건물명
  bdNm: string;            // 건물명
  bdKdcd: string;          // 공동주택여부
  siNm: string;            // 시도명
  sggNm: string;          // 시군구명
  emdNm: string;          // 읍면동명
  liNm: string;           // 법정리명
  rn: string;             // 도로명
  udrtYn: string;         // 지하여부
  buldMnnm: string;       // 건물본번
  buldSlno: string;       // 건물부번
  mtYn: string;           // 산여부
  lnbrMnnm: string;       // 지번본번
  lnbrSlno: string;       // 지번부번
  emdNo: string;          // 읍면동일련번호
}

export interface JusoApiResponse extends JusoCommonResponse {
  juso: JusoAddressData[];
}

export class JusoService {
  private readonly jusoConfig: JusoConfiguration;

  constructor(config: JusoConfiguration) {
    this.jusoConfig = config;
  }

  async searchAddress(request: JusoSearchRequest): Promise<JusoApiResponse> {
    try {
      if (!request.keyword) {
        throw new Error('검색어(keyword)는 필수입니다.');
      }

      // Build Juso API URL with parameters
      const apiUrl = new URL(this.jusoConfig.apiUrl);
      apiUrl.searchParams.set('currentPage', request.currentPage || '1');
      apiUrl.searchParams.set('countPerPage', request.countPerPage || '10');
      apiUrl.searchParams.set('resultType', 'json');
      apiUrl.searchParams.set('confmKey', this.jusoConfig.apiKey);
      apiUrl.searchParams.set('keyword', request.keyword);

      // Fetch from Juso API
      const apiResponse = await fetch(apiUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('Juso API Error Response:', errorText);
        throw new Error(`Juso API request failed: ${apiResponse.status} ${apiResponse.statusText} - ${errorText}`);
      }

      const apiDataText = await apiResponse.text();
      console.log('Juso API Raw Response:', apiDataText);
      
      // JSONP 응답을 JSON으로 변환
      let apiData: JusoApiResponse;
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
        throw new Error(`JSON 파싱 실패: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
      }
      
      return apiData;

    } catch (error) {
      console.error('Juso Search Service error:', error);
      throw error;
    }
  }
}