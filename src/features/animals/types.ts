// features/animals 도메인 전용 타입 정의 파일

/**
 * 메인 페이지 유기동물 미리보기 카드 1건.
 * ⚠️ [담당자 계약] animal 테이블 실스키마(V101 시드) 기준으로 작성 —
 *    미리보기 API(최신 4건) 응답 DTO를 이 형태로 맞춰주시거나, 다르면 이 타입과
 *    MainPage 목업을 실스펙으로 함께 수정해 주세요. (담당: 유기동물 도메인)
 */
export interface AnimalPreview {
  animalId: number;
  abandonmentId: string;       // 유기번호 — 공공API 원본 (예: "413587202600162")
  kind: 'D' | 'C';             // D=강아지, C=고양이 (표시 변환은 프론트)
  nickname: string;            // 미지정 시 DB DEFAULT '미정'
  gender: 'M' | 'F' | 'Q';     // 수/암/미상 (표시 변환은 프론트)
  typeName: string;            // 품종
  age: string;                 // ⚠️ 공공API 원본 문자열 그대로 (예: "2024", "2026(년생) 추정 2개월")
  location: string;            // 보호 장소
  likeCount: number;
  isFostered: boolean;         // 임시보호 중 여부 — 카드 상태 뱃지의 파생 근거
  imageUrl: string | null;     // ⚠️ NULL 가능 — 카드에서 placeholder 처리 필수
}