import { TabPlaceholder } from '@/pages/mypage/MyPageLayout';

// ⚠️ [임시보호 담당] 내가 신청한 임시보호 내역 — foster 상태(PENDING/REJECTED/FOSTERING/EXTENDED/ENDED)별
//    뱃지 표시를 권장합니다. 페이징은 PageResponse<T> 규격.
export function FosterHistoryTab() {
  return (
    <TabPlaceholder
      title="임시보호 신청 내역"
      owner="임시보호 도메인"
      guide="이 파일(FosterHistoryTab.tsx)을 실제 목록으로 교체해 주세요."
    />
  );
}