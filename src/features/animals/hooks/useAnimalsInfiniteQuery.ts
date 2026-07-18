import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { getAnimals } from "../api/animalsApi";
import type { AnimalFilters } from "../types";

// 유기동물 목록 무한스크롤 쿼리.
// 페이지 파라미터 = 페이지 번호(0부터). 다음 페이지 판정은 PageResponse.hasNext 하나로.
export function useAnimalsInfiniteQuery(filters: AnimalFilters) {
  return useInfiniteQuery({
    queryKey: queryKeys.animals.list(filters),
    queryFn: ({ pageParam }) => getAnimals(filters, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
  });
}
