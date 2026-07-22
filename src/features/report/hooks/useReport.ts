import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createReport, type ReportCreatePayload } from '@/features/report/api/reportApi';
import { getReportErrorMessage } from '@/features/report/util';
import { queryKeys } from '@/shared/api/queryKeys';

// 유저 신고 TanStack Query 훅.
// 접수 성공 시 관리자 신고 목록/상세(queryKeys.admin.reports())를 무효화해
// 이미 열려 있는 관리자 화면에도 새 신고가 반영되게 한다(승인/반려 뮤테이션과 동일 규칙).

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReportCreatePayload) => createReport(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reports() });
      toast.success('신고가 접수되었습니다.');
    },
    onError: (error) => {
      // REPORT_002(중복)/REPORT_005(자기 신고)는 사용자가 고칠 수 있는 상황이라 코드별로 안내한다.
      toast.error(getReportErrorMessage(error, '신고 접수에 실패했습니다.'));
    },
  });
}
