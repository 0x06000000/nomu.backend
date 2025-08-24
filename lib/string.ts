/**
    * 문자열의 공백을 정규화하는 함수
    * 1. 앞뒤 공백 제거
    * 2. 중간의 연속된 공백을 제거
    * @param input 정규화할 문자열
    * @returns 정규화된 문자열
    */
export function normalizeWhitespace(input: string | null | undefined): string {
    if (!input) return '';

    // 앞뒤 공백 제거
    let trimmed = input.trim();

    // 중간의 두 개 이상의 연속된 공백을 제거
    // \s{2,}는 2개 이상의 연속된 공백 문자를 의미
    let normalized = trimmed.replace(/\s{2,}/g, '');

    return normalized;
}