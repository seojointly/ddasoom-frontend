import { axiosInstance } from '@/shared/api/axiosInstance';
import type { ApiResponse, PageResponse } from '@/shared/types/api';
import type { AnimalDetail, AnimalFilters, AnimalListItem, AnimalPreview } from '../types';

// features/animals 도메인 API 모듈.
// 백엔드: animal/controller/AnimalController.java (/api/animals)
// 응답은 전부 ApiResponse<T> 봉투 → data 필드만 추출해 반환한다.

/**
 * 목록 조회(동적 검색 + 페이징). GET /api/animals/list
 * 공개 API지만, 로그인 상태면 axios 인터셉터가 AT를 붙여 isLiked가 계산돼 온다.
 * page는 0부터(Spring 표준).
 */
export async function getAnimals(
  filters: AnimalFilters,
  page: number,
  size = 12,
): Promise<PageResponse<AnimalListItem>> {
  // 값이 정의된 필터만 실어 보낸다(undefined는 축약, 서버에서 "필터 미적용"으로 처리).
  const params: Record<string, string | number | boolean> = { page, size };
  if (filters.kind !== undefined) params.kind = filters.kind;
  if (filters.gender !== undefined) params.gender = filters.gender;
  if (filters.location) params.location = filters.location;
  if (filters.isFostered !== undefined) params.isFostered = filters.isFostered;
  if (filters.isLiked !== undefined) params.isLiked = filters.isLiked;

  const { data } = await axiosInstance.get<ApiResponse<PageResponse<AnimalListItem>>>(
    '/animals/list',
    { params },
  );
  return data.data!;
}

/** 상세 조회. GET /api/animals/{animalId} (공개, 로그인 시 isLiked 포함) */
export async function getAnimalDetail(animalId: number): Promise<AnimalDetail> {
  const { data } = await axiosInstance.get<ApiResponse<AnimalDetail>>(`/animals/${animalId}`);
  return data.data!;
}

/** 좋아요. POST /api/animals/{animalId}/likes (인증 필요) */
export async function likeAnimal(animalId: number): Promise<void> {
  await axiosInstance.post(`/animals/${animalId}/likes`);
}

/** 좋아요 취소. DELETE /api/animals/{animalId}/likes (인증 필요) */
export async function unlikeAnimal(animalId: number): Promise<void> {
  await axiosInstance.delete(`/animals/${animalId}/likes`);
}

/** 마이페이지 — 내가 좋아요한 동물 목록. GET /api/animals/me/likes (인증 필요) */
export async function getLikedAnimals(
  page: number,
  size = 12,
): Promise<PageResponse<AnimalListItem>> {
  const { data } = await axiosInstance.get<ApiResponse<PageResponse<AnimalListItem>>>(
    '/animals/me/likes',
    { params: { page, size } },
  );
  return data.data!;
}

/** 메인페이지 미리보기 - 최근 등록 4건. GET /api/animals/main (공개) */
export async function getMainAnimals(): Promise<AnimalPreview[]> {
  const { data } = await axiosInstance.get<ApiResponse<AnimalPreview[]>>('/animals/main');
  return data.data!;
}