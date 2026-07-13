import { useNavigate } from 'react-router-dom';
import { MessageCircle, Eye, type LucideIcon } from 'lucide-react';
import { MoreButton } from '@/shared/components/common/MoreButton';
import type { PostPreview } from '@/features/board/types';

// 메인 페이지 게시글 미리보기 섹션 — 입양후기/펫 커뮤니티가 이 컴포넌트 하나를 공용한다.
// 피그마 원형: 섹션 헤더 = 아이콘 + 타이틀 / 카드 배경은 섹션 배경과 반전(후기: 흰 섹션+크림 카드, 커뮤니티: 크림 섹션+흰 카드)
interface ContentPreviewSectionProps {
  icon: LucideIcon;          // 피그마: 후기 Heart / 커뮤니티 Users
  title: string;
  posts: PostPreview[];
  moreLabel: string;         // 피그마: "후기 더 보기" / "게시글 더 보기"
  listPath: string;          // "더보기"와 카드 클릭이 이동할 목록 경로 — 실제 라우트는 board 담당자와 협의
  background?: 'white' | 'cream';
}

export function ContentPreviewSection({
  icon: Icon, title, posts, moreLabel, listPath, background = 'white',
}: ContentPreviewSectionProps) {
  const navigate = useNavigate();
  const isCream = background === 'cream';

  return (
    <section className={`py-14 ${isCream ? 'bg-secondary' : 'bg-white'}`}>
      <div className="mx-auto max-w-6xl px-6">
        {/* 섹션 헤더 — 피그마 원형: 아이콘 + 타이틀 (설명 문구 없음) */}
        <div className="mb-8 flex items-center gap-2">
          <Icon size={30} className="text-primary" />
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.postId}
              onClick={() => navigate(listPath)} // 상세 라우트 확정 전까지 목록으로 — 담당자 협의 후 상세 경로로 교체
              className={`cursor-pointer overflow-hidden rounded-2xl border border-border transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_12px_32px_rgba(244,185,66,0.16)] ${
                isCream ? 'bg-white' : 'bg-background'
              }`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                    {post.category}
                  </span>
                  {/* 날짜/조회수 등 메타 정보만 text-xs 허용 (타이포 규칙) */}
                  <span className="text-xs text-[#C4B4A4]">{post.createdAt}</span>
                </div>
                <h3 className="mb-2 line-clamp-1 text-lg font-bold text-foreground transition-colors hover:text-ring">
                  {post.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{post.summary}</p>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm font-medium text-ring">{post.authorNickname}</span>
                  <div className="flex items-center gap-3 text-xs text-[#C4B4A4]">
                    <span className="flex items-center gap-1"><MessageCircle size={13} />{post.commentCount}</span>
                    <span className="flex items-center gap-1"><Eye size={13} />{post.viewCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <MoreButton label={moreLabel} onClick={() => navigate(listPath)} />
        </div>
      </div>
    </section>
  );
}