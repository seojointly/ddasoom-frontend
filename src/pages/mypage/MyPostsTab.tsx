import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, FileText, MessageSquare, PawPrint } from 'lucide-react';
import { useMyPostsQuery } from '@/features/board/hooks/useMyBoard';
import { BOARD_BY_SLUG, resolveSlugByBoardType } from '@/features/board/types';
import type { BoardSlug } from '@/features/board/types';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { formatDate } from '@/shared/utils/date';

// 보드 필터 — 값은 백엔드 BoardType enum 문자열, 라벨은 BOARD_BY_SLUG와 일치시킴(메인 관행 준수)
const BOARD_OPTIONS: { value: 'ALL' | string; label: string }[] = [
  { value: 'ALL', label: '전체' },
  ...(Object.keys(BOARD_BY_SLUG) as BoardSlug[]).map((slug) => ({
    value: BOARD_BY_SLUG[slug].boardType as string,
    label: BOARD_BY_SLUG[slug].label,
  })),
];

export function MyPostsTab() {
  const [boardType, setBoardType] = useState<'ALL' | string>('ALL');
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useMyPostsQuery({
    boardType: boardType === 'ALL' ? undefined : boardType,
    page,
  });

  const handleBoardChange = (value: 'ALL' | string) => {
    setBoardType(value);
    setPage(0); // 필터 변경 시 첫 페이지로
  };

  if (isLoading) {
    return (
      <div className='rounded-2xl border border-border bg-white p-8'>
        <Skeleton className='mb-6 h-8 w-48' />
        <div className='space-y-3'>
          <Skeleton className='h-24 w-full' />
          <Skeleton className='h-24 w-full' />
          <Skeleton className='h-24 w-full' />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='rounded-2xl border border-border bg-white p-8 text-center'>
        <p className='text-base text-destructive'>
          내가 쓴 글 목록을 불러오지 못했습니다.
        </p>
      </div>
    );
  }

  const posts = data?.content ?? [];

  return (
    <section className='rounded-2xl border border-border bg-white p-8'>
      <div className='mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <div className='flex items-center gap-2'>
            <FileText className='text-ring' size={24} />
            <h2 className='text-2xl font-bold text-foreground'>내가 쓴 글</h2>
          </div>
          <p className='mt-1 text-sm text-muted-foreground'>
            입양 후기와 정보 게시판에 작성한 글을 한 곳에서 확인할 수 있어요.
          </p>
        </div>

        <div className='flex flex-wrap gap-2'>
          {BOARD_OPTIONS.map((option) => {
            const isSelected = boardType === option.value;

            return (
              <Button
                key={option.value}
                type='button'
                variant={isSelected ? 'default' : 'outline'}
                size='sm'
                aria-pressed={isSelected}
                onClick={() => handleBoardChange(option.value)}
              >
                {option.label}
              </Button>
            );
          })}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className='flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-secondary/50 text-center'>
          <PawPrint className='text-muted-foreground/50' size={32} />
          <p className='text-base text-muted-foreground'>
            작성한 글이 없습니다.
          </p>
        </div>
      ) : (
        <ul className='space-y-3'>
          {posts.map((post) => {
            const slug = resolveSlugByBoardType(post.boardType);
            const boardLabel = slug
              ? BOARD_BY_SLUG[slug].label
              : post.boardType;

            return (
              <li key={post.postId}>
                <Link
                  to={`/board/${slug}/${post.postId}`}
                  className='flex items-center gap-4 rounded-xl border border-border p-4 transition-colors hover:bg-secondary/50'
                >
                  {post.thumbnailUrl ? (
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className='h-16 w-16 shrink-0 rounded-lg object-cover'
                    />
                  ) : (
                    <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary'>
                      <FileText className='text-muted-foreground' size={24} />
                    </div>
                  )}

                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='shrink-0 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-ring'>
                        {boardLabel} · {post.category}
                      </span>
                    </div>
                    <p className='mt-1 truncate text-lg font-bold text-foreground'>
                      {post.title}
                    </p>
                    <div className='mt-1 flex items-center gap-3 text-sm text-muted-foreground'>
                      <span>{formatDate(post.createdAt)}</span>
                      <span className='flex items-center gap-1'>
                        <Eye size={14} /> {post.viewCount}
                      </span>
                      <span className='flex items-center gap-1'>
                        <MessageSquare size={14} /> {post.commentCount}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <div className='mt-6 flex items-center justify-center gap-3'>
        <Button
          variant='outline'
          size='sm'
          disabled={!data?.hasPrevious}
          onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))}
        >
          이전
        </Button>
        <span className='text-sm text-muted-foreground'>
          {(data?.page ?? 0) + 1} / {Math.max(1, data?.totalPages ?? 0)}
        </span>
        <Button
          variant='outline'
          size='sm'
          disabled={!data?.hasNext}
          onClick={() => setPage((currentPage) => currentPage + 1)}
        >
          다음
        </Button>
      </div>
    </section>
  );
}
