import { Heart, Users } from 'lucide-react';
import { AnimalPreviewSection } from '@/features/animals/components/AnimalPreviewSection';
import { ContentPreviewSection } from '@/features/board/components/ContentPreviewSection';
import type { AnimalPreview } from '@/features/animals/types';
import type { PostPreview } from '@/features/board/types';
import { useMainAnimalsQuery } from '@/features/animals/hooks/useMainAnimalsQuery';

// 메인 페이지 — 섹션 조립만 담당한다(구현은 features).
//
// ⭐ [팀원 안내 — API 연동 방법]
//   아래 MOCK_* 상수가 각 도메인 미리보기 API로 교체될 자리입니다.
//   1. 본인 도메인의 미리보기 API(최신 4건)가 준비되면 features/{도메인}/api/{도메인}Api.ts 에 호출 함수 작성
//      (작성 예시: features/auth/api/authApi.ts)
//   2. 이 파일에서 해당 MOCK_* 상수를 useQuery 결과로 교체 — 섹션 컴포넌트는 수정 불필요(데이터는 props 계약)
//   3. 응답 필드가 features/{도메인}/types.ts 의 계약 타입과 다르면 타입·목업을 실스펙으로 함께 수정
//   4. 미리보기 API는 비로그인도 보는 메인에 노출되므로 반드시 PUBLIC_URIS(공개)로 등록해 주세요.

// V101__seed_animal.sql 기준 — 활성(deleted_at NULL) + 이미지 보유 4건을 시드 값 그대로 사용.
// API 연동 시 이 상수를 useQuery 결과로 교체하면 됩니다(파일 상단 ⭐ 주석 참고).

const MOCK_REVIEWS: PostPreview[] = [
  { postId: 1, title: '우리 가족이 된 초롱이, 정말 행복해요', summary: '처음엔 걱정도 많았는데, 지금은 없어선 안 될 소중한 가족이 되었어요. 입양 과정도 친절하게 안내해 주셔서 감사했습니다.', category: '강아지', authorNickname: '김민지', createdAt: '2026.06.15', commentCount: 24, viewCount: 1032, imageUrl: 'https://images.unsplash.com/photo-1526363269865-60998e11d82d?fm=jpg&w=500' },
  { postId: 2, title: '하늘이와 함께한 1년, 매일이 행복입니다', summary: '처음에 낯을 많이 가렸는데 이제는 제 옆을 항상 따라다니는 귀여운 아이가 됐어요. 정말 잘 입양했다고 생각해요.', category: '고양이', authorNickname: '박서준', createdAt: '2026.05.22', commentCount: 18, viewCount: 876, imageUrl: 'https://images.unsplash.com/photo-1620148639493-5a7cc139813d?fm=jpg&w=500' },
  { postId: 3, title: '온 가족이 사랑하는 뭉글이예요', summary: '아이들이 너무 좋아해요. 주말마다 공원에 나가 뛰어놀고, 온 가족이 활기차게 생활하게 됐어요. 정말 감사합니다!', category: '강아지', authorNickname: '이수현', createdAt: '2026.04.05', commentCount: 31, viewCount: 2140, imageUrl: 'https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?fm=jpg&w=500' },
];

const MOCK_COMMUNITY: PostPreview[] = [
  { postId: 1, title: '처음 강아지 키우는 분들께 드리는 꿀팁 모음', summary: '1년째 키우면서 겪었던 시행착오와 유용했던 정보들을 정리해봤어요. 특히 배변 훈련이 가장 중요한 것 같아요.', category: '강아지', authorNickname: '멍멍맘', createdAt: '2026.07.01', commentCount: 47, viewCount: 3812, imageUrl: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?fm=jpg&w=500' },
  { postId: 2, title: '고양이 중성화 수술 후기 & 주의사항 공유', summary: '수술 전 걱정을 많이 했는데 생각보다 잘 회복했어요. 수술 후 케어 방법을 자세히 공유합니다.', category: '고양이', authorNickname: '냥이집사', createdAt: '2026.06.28', commentCount: 33, viewCount: 2654, imageUrl: 'https://images.unsplash.com/photo-1582725461742-8ecd962c260d?fm=jpg&w=500' },
  { postId: 3, title: '유기견 입양 6개월 후기, 달라진 점들', summary: '처음엔 낯선 환경에 적응 못 하더니 이제는 집 구석구석을 본인 구역처럼 활보해요. 변화 과정을 담았습니다.', category: '강아지', authorNickname: '행복한하루', createdAt: '2026.06.20', commentCount: 29, viewCount: 1987, imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?fm=jpg&w=500' },
];

export function MainPage() {
  // 유기동물 미리보기(최근 4건) - 로딩 중이면 빈 배열로 섹션은 검색바만 노출
  const { data: animals } = useMainAnimalsQuery();

  return (
    <>
      {/* ── 히어로 ── */}
      <section className="relative h-[52vh] min-h-[420px] overflow-hidden md:min-h-[520px]">
        <img
          src="https://images.unsplash.com/photo-1724024056572-0dead0189caf?fm=jpg&w=1400"
          alt="창가에서 쉬고 있는 고양이"
          className="h-full w-full object-cover object-center"
        />
        {/* 텍스트가 놓이는 좌측을 더 어둡게 — 가독성용 웜 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-6">
            <p className="mb-3 text-base font-semibold uppercase tracking-[0.2em] text-accent">새로운 인연의 시작</p>
            <h1 className="mb-3 text-3xl font-bold leading-snug text-white md:text-5xl">
              새로운 가족을 기다리는<br />아이들을 만나보세요
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-[#EED9B6]">
              전국 각지의 유기동물 보호소에서 새 가족을 기다리는<br />소중한 생명들과 함께하세요.
            </p>
          </div>
        </div>
      </section>

            {/* ── 미리보기 3종 — 목업 주입 (API 연동 방법은 상단 ⭐ 주석) ── */}
      <AnimalPreviewSection animals={animals ?? []} />
      <ContentPreviewSection
        icon={Heart}
        title="입양 후기"
        posts={MOCK_REVIEWS}
        moreLabel="후기 더 보기"
        listPath="/board?category=review"
      />
      <ContentPreviewSection
        icon={Users}
        title="커뮤니티"
        posts={MOCK_COMMUNITY}
        moreLabel="게시글 더 보기"
        listPath="/board"
        background="cream"
      />

      {/* ── CTA 배너 — 피그마 원형: "입양 후기를 나눠주세요" + 후기 작성하기 ── */}
      <section className="bg-primary py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
          <div>
            <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">입양 후기를 나눠주세요</h2>
            <p className="max-w-lg text-lg leading-relaxed text-foreground/70">
              소중한 입양 경험을 공유해주세요.<br />
              여러분의 이야기가 다른 아이들에게 새 가족을 만들어 줄 수 있어요.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            {/* TODO(board 담당): 후기 작성 라우트 확정 시 이동 경로 연결 (현재 목록으로) */}
            <button
              onClick={() => (window.location.href = '/board?category=review')}
              className="rounded-full bg-ring px-8 py-3 text-base font-bold text-white transition-all hover:brightness-95"
            >
              후기 작성하기
            </button>
          </div>
        </div>
      </section>
    </>
  );
}