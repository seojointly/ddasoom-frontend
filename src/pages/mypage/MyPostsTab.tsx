import { TabPlaceholder } from '@/pages/mypage/MyPageLayout';

// ⚠️ [커뮤니티 담당] 내가 쓴 글 목록 — 입양후기/펫커뮤니티 구분 표시 필요 (탭 내 토글 또는 필터 권장,
//    메인의 PostPreview.category 관행과 일치시켜 주세요). 각 행 클릭 시 게시글 상세로 이동.
export function MyPostsTab() {
  return (
    <TabPlaceholder
      title="내가 쓴 글"
      owner="커뮤니티 도메인"
      guide="이 파일(MyPostsTab.tsx)을 실제 목록으로 교체해 주세요. (후기/커뮤니티 구분 토글 포함)"
    />
  );
}