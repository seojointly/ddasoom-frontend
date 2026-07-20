import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/api/queryKeys";
import { getAnimalDetail } from "../api/animalsApi";

// 유기동물 상세 조회. 로그인 상태면 응답에 isLiked가 채워진다.
export function useAnimalDetailQuery(animalId: number) {
  return useQuery({
    queryKey: queryKeys.animals.detail(animalId),
    queryFn: () => getAnimalDetail(animalId),
    enabled: Number.isFinite(animalId), // 잘못된 id(NaN)면 호출 안 함
  });
}
