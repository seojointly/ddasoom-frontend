import { TabPlaceholder } from '@/pages/mypage/MyPageLayout';

// ⚠️ [유기동물 담당] 내가 좋아요한 동물 목록 — animal_like 기준.
//    이 컴포넌트를 실제 목록으로 교체해 주세요. 카드 UI는 메인의 AnimalPreviewSection 카드 참고,
//    페이징은 PageResponse<T>(shared/types/api) 규격, API 모듈은 features/animals/api에 작성.
export function LikedAnimalsTab() {
  return (
    <TabPlaceholder
      title="좋아요한 아이들"
      owner="유기동물 도메인"
      guide="이 파일(LikedAnimalsTab.tsx)을 실제 목록으로 교체해 주세요."
    />
  );
}