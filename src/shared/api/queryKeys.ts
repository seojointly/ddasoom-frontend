// TanStack Query queryKey 팩토리.
// queryKey는 반드시 이 팩토리를 경유해서 생성한다(즉석 문자열/배열 키 금지 — 무효화/일관성 보장).
// 예) useQuery({ queryKey: queryKeys.animals.list(filters) })
//
// 현재는 도메인별 뼈대(빈 객체 + 주석)만 둔다. 실제 키 함수는 각 도메인 담당자가
// 자기 features 폴더 작업 시 아래 규약을 따라 채운다.
//
// 규약(권장 형태):
//   domain: {
//     all:    ['animals'] as const,                                  // 도메인 전체 무효화용 루트 키
//     lists:  () => [...queryKeys.animals.all, 'list'] as const,
//     list:   (params) => [...queryKeys.animals.lists(), params] as const,
//     details:() => [...queryKeys.animals.all, 'detail'] as const,
//     detail: (id) => [...queryKeys.animals.details(), id] as const,
//   }

import { PostListParams } from '@/features/board/types';

export const queryKeys = {
  // features/auth
  auth: {},
  // features/animals — 유기동물 (김종식)
  animals: {},
  // features/board — 정보교환/입양후기 통합(boardType 파라미터로 분기) (유창호)
  // features/board — 정보교환/입양후기 통합(boardType 파라미터로 분기) (유창호)
  board: {
    all: ['board'] as const,
    lists: () => [...queryKeys.board.all, 'list'] as const,
    list: (params: PostListParams) =>
      [...queryKeys.board.lists(), params] as const,
    details: () => [...queryKeys.board.all, 'detail'] as const,
    detail: (postId: number) => [...queryKeys.board.details(), postId] as const,
    // 댓글 키는 detail(postId) 하위 — 게시글 무효화 시 댓글도 함께 무효화되는 계층 관계.
    // ⚠️ 역은 성립 안 함: 댓글 무효화(comments)는 detail 쿼리를 건드리지 않는다.
    //    (detail 재조회 = 조회수 증가 부작용이 있어 댓글 작성마다 detail을 invalidate하지 않기 위한 설계)
    comments: (postId: number) =>
      [...queryKeys.board.detail(postId), 'comments'] as const,
    commentList: (postId: number, page: number) =>
      [...queryKeys.board.comments(postId), page] as const,
  },
  // features/foster — 임시보호 (김경우)
  foster: {},
  // features/mypage — 마이페이지 (구지훈)
  mypage: {
    all: ['mypage'] as const,
    myInfo: () => [...queryKeys.mypage.all, 'myInfo'] as const,
    recentLoginLogs: () =>
      [...queryKeys.mypage.all, 'recentLoginLogs'] as const,
  },
  // features/admin — 공지사항, Faq, Qna, 관리자페이지 (이서진)
  admin: {
    all: ['admin'] as const,
    // ===== 공지사항 (이서진) =======
    notices: () => [...queryKeys.admin.all, 'notices'] as const,
    noticeList: (params: { page?: number; size?: number }) =>
      [...queryKeys.admin.notices(), 'list', params] as const,
    noticeDetail: (id: number) =>
      [...queryKeys.admin.notices(), 'detail', id] as const,

    // ===== FAQ (이서진) =======
    // FAQ는 페이징이 없으므로 faqList 파라미터 키 불필요 — faqs() 하나로 목록 전체 무효화
    faqs: () => [...queryKeys.admin.all, 'faqs'] as const,
    faqDetail: (id: number) =>
      [...queryKeys.admin.faqs(), 'detail', id] as const,
    faqCategories: () => [...queryKeys.admin.all, 'faqCategories'] as const,
    // ===== QNA (이서진) =======

    // ===== 구지훈 (유저 관리) =======
    members: () => [...queryKeys.admin.all, 'members'] as const,
    memberList: (params: {
      keyword?: string;
      role?: string;
      page?: number;
      size?: number;
    }) => [...queryKeys.admin.members(), 'list', params] as const,
    memberDetail: (id: number) =>
      [...queryKeys.admin.members(), 'detail', id] as const,
    memberLoginLogs: (id: number, page: number) =>
      [...queryKeys.admin.members(), 'loginLogs', id, page] as const,
    // ===== 김경우 (임시보호 신청 관리) =======
    // ===== 유창호 (게시글 관리) =======
  },

  // features/support — 유저용 공지/FAQ/QnA 열람
  support: {
    all: ['support'] as const,
    notices: () => [...queryKeys.support.all, 'notices'] as const,
    noticeList: (params: { page?: number; size?: number }) =>
      [...queryKeys.support.notices(), 'list', params] as const,
    noticeDetail: (id: number) =>
      [...queryKeys.support.notices(), 'detail', id] as const,
  },
} as const;
