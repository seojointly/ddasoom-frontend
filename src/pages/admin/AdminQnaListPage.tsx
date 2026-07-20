import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminQnas } from '@/features/admin/hooks/useAdminQnas';
import { QnaStatusBadge } from '@/features/qna/components/QnaStatusBadge';
import { QnaPagination } from '@/features/qna/components/QnaPagination';
import type { QnaStatus } from '@/features/qna/types';
import { formatDate } from '@/shared/utils/date';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';

// 상태 필터 탭 — undefined는 "전체"(status 파라미터 미전송).
const STATUS_FILTERS: { label: string; value: QnaStatus | undefined }[] = [
  { label: '전체', value: undefined },
  { label: '답변 대기', value: 'PENDING' },
  { label: '답변 완료', value: 'ANSWERED' },
];

export function AdminQnaListPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<QnaStatus | undefined>(undefined);
  const [page, setPage] = useState(0);

  const { data, isLoading, isError } = useAdminQnas({ status, page, size: 10 });

  // 필터가 바뀌면 이전 페이지 번호가 새 결과 범위를 넘길 수 있어 첫 페이지로 되돌린다.
  const handleFilterChange = (next: QnaStatus | undefined) => {
    setStatus(next);
    setPage(0);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">불러오는 중…</div>;
  }
  if (isError) {
    return <div className="p-8 text-center text-destructive">목록을 불러오지 못했습니다.</div>;
  }

  const qnas = data?.content ?? [];

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">1:1 문의 관리</h1>
      </div>

      <div className="mb-4 flex gap-2">
        {STATUS_FILTERS.map((filter) => (
          <Button
            key={filter.label}
            variant={status === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange(filter.value)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">번호</TableHead>
              <TableHead>제목</TableHead>
              <TableHead className="w-32">작성자</TableHead>
              <TableHead className="w-28">상태</TableHead>
              <TableHead className="w-32">작성일</TableHead>
              <TableHead className="w-32">답변일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {qnas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  등록된 문의가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              qnas.map((qna) => (
                <TableRow
                  key={qna.qnaId}
                  className="cursor-pointer"
                  onClick={() => navigate(`/admin/qnas/${qna.qnaId}`)}
                >
                  <TableCell>{qna.qnaId}</TableCell>
                  <TableCell className="font-medium">{qna.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {qna.questionerNickname}
                  </TableCell>
                  <TableCell>
                    <QnaStatusBadge status={qna.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(qna.createdAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(qna.updatedAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <QnaPagination
        page={data?.page ?? 0}
        totalPages={data?.totalPages ?? 1}
        hasPrevious={data?.hasPrevious ?? false}
        hasNext={data?.hasNext ?? false}
        onChange={setPage}
      />
    </div>
  );
}
