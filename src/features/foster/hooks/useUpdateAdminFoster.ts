import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateAdminFoster } from '@/features/foster/api/fosterAdminApi';
import type { FosterAdminUpdatePayload } from '@/features/foster/types';
import { queryKeys } from '@/shared/api/queryKeys';

interface UpdateAdminFosterVariables {
  fosterId: number;
  payload: FosterAdminUpdatePayload;
}

export function useUpdateAdminFoster() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fosterId, payload }: UpdateAdminFosterVariables) =>
      updateAdminFoster(fosterId, payload),
    onSuccess: (_, { fosterId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.fosters(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.fosterDetail(fosterId),
      });

      // 관리자 상태 변경은 사용자 신청 내역·신청 가능 여부·동물 보호 상태에도 영향을 준다.
      queryClient.invalidateQueries({
        queryKey: queryKeys.foster.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.foster.details(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.foster.pendingApplications(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.animals.all(),
      });

      toast.success('임시보호 신청 처리 정보가 수정되었습니다.');
    },
  });
}