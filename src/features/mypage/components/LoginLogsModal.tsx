import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { getMyLoginLogs, type LoginLogItem } from '@/features/mypage/api/memberApi';
import type { PageResponse } from '@/shared/types/api';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/shared/components/ui/dialog';

// 로그인 방식 라벨 — ProfileTab과 공유하는 표기 (관리자 페이지도 동일 라벨 사용 예정)
const LOGIN_TYPE_LABEL: Record<string, string> = {
  LOCAL: '이메일 로그인', KAKAO: '카카오', NAVER: '네이버', GOOGLE: '구글',
};
const PAGE_SIZE = 20;

// 내 로그인 이력 전체 보기 — 모달 + 페이징(이전/다음).
// 페이징 문법(행 구성·이동 UI)은 관리자 페이지 테이블과 통일하기로 합의된 양식.
export function LoginLogsModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<PageResponse<LoginLogItem> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    getMyLoginLogs(page, PAGE_SIZE)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setIsLoading(false));
  }, [open, page]);

  // 모달을 닫으면 다음에 열 때 1페이지부터 (이전 탐색 상태를 이어갈 이유가 없음)
  const handleOpenChange = (next: boolean) => {
    if (!next) setPage(0);
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn size={19} className="text-ring" /> 전체 로그인 이력
          </DialogTitle>
          <DialogDescription>계정 보안을 위해 낯선 로그인이 있는지 확인해 보세요.</DialogDescription>
        </DialogHeader>

        {/* 목록 — 고정 높이로 페이지 전환 시 모달 크기 출렁임 방지 */}
        <div className="min-h-[380px]">
          {isLoading ? (
            <p className="py-10 text-center text-sm text-muted-foreground">불러오는 중…</p>
          ) : !data || data.content.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">로그인 이력이 없어요.</p>
          ) : (
            <ul className="divide-y divide-border">
              {data.content.map((log) => (
                <li key={log.loginLogId} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="font-medium text-foreground">
                    {LOGIN_TYPE_LABEL[log.loginType] ?? log.loginType}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(log.loginAt).toLocaleString('ko-KR')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 페이징 — 이전/다음 + 현재/전체 (관리자 테이블과 동일 문법) */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border pt-3">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0 || isLoading}
              className="flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40"
            >
              <ChevronLeft size={15} /> 이전
            </button>
            <span className="text-sm text-muted-foreground">
              {page + 1} / {data.totalPages} 페이지 (총 {data.totalElements}건)
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.hasNext || isLoading}
              className="flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary disabled:opacity-40"
            >
              다음 <ChevronRight size={15} />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}