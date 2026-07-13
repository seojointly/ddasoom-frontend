import { TabPlaceholder } from '@/pages/mypage/MyPageLayout';

// ⚠️ [커뮤니티 담당] 내가 쓴 댓글 목록 — 댓글 내용 + 원글 제목 표시, 행 클릭 시 해당 게시글로 이동.
export function MyCommentsTab() {
  return (
    <TabPlaceholder
      title="내가 쓴 댓글"
      owner="커뮤니티 도메인"
      guide="이 파일(MyCommentsTab.tsx)을 실제 목록으로 교체해 주세요."
    />
  );
}