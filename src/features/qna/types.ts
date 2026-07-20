// features/qna 도메인 타입 — 1:1 문의(Qna) + 코멘트 스레드(QnaComment).
// 백엔드 DTO와 1:1 대응. 관리자 화면(features/admin/api/qnaApi.ts)도 이 타입을 공유한다.

/** 문의 상태 — 관리자 답변 시 ANSWERED, 유저 재질문 시 다시 PENDING으로 순환한다. */
export type QnaStatus = 'PENDING' | 'ANSWERED';

/** 코멘트 작성자 역할 — 관리자 코멘트를 시각적으로 구분하는 데 사용. */
export type QnaWriterRole = 'USER' | 'ADMIN';

/**
 * 첨부 이미지.
 * ⚠️ url은 Presigned(30분 유효) — 상세 진입 시마다 새로 받는 값이므로 오래 캐싱하지 않는다.
 */
export interface ImageResponse {
  imageId: number;
  url: string;
  isThumbnail: boolean;
}

/** 목록 행 — QnaSummaryResponse */
export interface QnaSummary {
  qnaId: number;
  questionerNickname: string;
  title: string;
  status: QnaStatus;
  createdAt: string;
  answeredAt: string | null;
  updatedAt: string;
}

/** 스레드 코멘트 — QnaCommentResponse */
export interface QnaComment {
  commentId: number;
  writerNickname: string;
  writerRole: QnaWriterRole;
  content: string;
  createdAt: string;
  images: ImageResponse[];
}

/** 상세 — QnaDetailResponse. 코멘트 작성 응답도 동일 형태로 내려온다. */
export interface QnaDetail {
  qnaId: number;
  questionerNickname: string;
  title: string;
  content: string;
  status: QnaStatus;
  createdAt: string;
  answeredAt: string | null;
  updatedAt: string;
  images: ImageResponse[];
  comments: QnaComment[];
}

/** 요청: QnaCreateRequest */
export interface QnaCreatePayload {
  title: string;
  content: string;
  imageIds?: number[];
}

/** 요청: QnaCommentCreateRequest — 유저 재질문·관리자 답변 공용 */
export interface QnaCommentCreatePayload {
  content: string;
  imageIds?: number[];
}

/**
 * 문의 1건당 첨부 상한 — 백엔드 IMAGE_003 기준 10장.
 * ⚠️ 에디터(shared/components/editor)의 MAX_IMAGES(20)와는 다른 값이다.
 *    QnA는 첨부형이라 상한이 별도 — 에디터 상수를 재사용하지 말 것.
 */
export const MAX_QNA_IMAGES = 10;
