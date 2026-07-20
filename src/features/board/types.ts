// features/board 도메인 전용 타입 정의 파일

export interface PostPreview {
  postId: number;
  title: string;
  summary: string; // 본문 요약 (2줄 표시)
  category: string; // 입양후기: 펫 종류 / 커뮤니티: 게시판 분류
  authorNickname: string;
  createdAt: string; // 표시용 날짜 문자열 (예: "2026.07.01")
  commentCount: number;
  viewCount: number;
  imageUrl: string; // 썸네일
}

// categories: 글 작성/수정 select + 목록 필터 공용.
// ⚠️ 백엔드 PostService.CATEGORY_WHITELIST와 반드시 일치해야 함 (서버가 생성/수정 시 재검증).
export const BOARD_BY_SLUG = {
  'dog-info': {
    boardType: 'DOG_INFO',
    label: '강아지',
    categories: ['예방접종'],
  },
  'cat-info': {
    boardType: 'CAT_INFO',
    label: '고양이',
    categories: ['예방접종'],
  },
  review: {
    boardType: 'ADOPTION_REVIEW',
    label: '입양 후기',
    categories: ['강아지', '고양이'],
  },
} as const;

export type BoardSlug = keyof typeof BOARD_BY_SLUG;

export function resolveBoard(slug: string | undefined) {
  return slug && slug in BOARD_BY_SLUG
    ? BOARD_BY_SLUG[slug as BoardSlug]
    : undefined; // 알 수 없는 slug → 호출부에서 NotFoundPage 렌더
}

// boardType(백엔드 enum 문자열) → slug 역방향 조회. 상세 페이지에서 수정 경로를 만들 때 사용.
export function resolveSlugByBoardType(
  boardType: string,
): BoardSlug | undefined {
  return (Object.keys(BOARD_BY_SLUG) as BoardSlug[]).find(
    (slug) => BOARD_BY_SLUG[slug].boardType === boardType,
  );
}

export interface Author {
  memberId: number; // 백엔드 Long
  nickname: string;
}

export interface PostListItem {
  postId: number;
  category: string;
  title: string;
  contentPreview: string; // 본문 앞 200자 — 말줄임은 CSS(line-clamp)
  thumbnailUrl: string | null; // 미지정 시 null → 기본 이미지 처리
  author: Author;
  viewCount: number;
  commentCount: number;
  createdAt: string; // LocalDateTime → ISO 문자열(타임존 없음). 표시 포맷은 프론트
}

// GET /api/posts 쿼리 파라미터
export interface PostListParams {
  boardType: string;
  category?: string;
  page?: number;
  size?: number;
}

//
export interface PostCreatePayload {
  boardType: string; // "ADOPTION_REVIEW" 고정
  category: string; // "강아지" | "고양이"
  title: string;
  content: string; // getPayload().html
  imageIds: number[]; // getPayload().imageIds
  thumbnailImageId: number | null;
}

export type PostUpdatePayload = PostCreatePayload;

// ===== 게시글 상세 / 댓글 =====

export interface PostImage {
  imageId: number;
  url: string;
  isThumbnail: boolean;
}

export interface PostDetail {
  postId: number;
  boardType: string; // 백엔드 enum 문자열 (DOG_INFO / CAT_INFO / ADOPTION_REVIEW)
  category: string;
  title: string;
  content: string; // 백엔드 sanitize 완료 HTML — 렌더는 SafeHtmlViewer(DOMPurify 이중 방어)
  author: Author;
  images: PostImage[]; // image_order 오름차순 (ImageService.getImages 보장)
  viewCount: number;
  commentCount: number;
  createdAt: string; // LocalDateTime → ISO 문자열(타임존 없음)
  updatedAt: string;
}

export interface CommentItem {
  commentId: number;
  author: Author;
  content: string;
  createdAt: string;
  updatedAt: string;
}
