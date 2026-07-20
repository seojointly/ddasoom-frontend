import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { getMainAnimals } from "../api/animalsApi";

// 메인페이지 유기동물 미리보기(최근 4건) 조회.
export function useMainAnimalsQuery() {
  return useQuery({
    queryKey: queryKeys.animals.main(),
    queryFn: getMainAnimals,
  });
}
