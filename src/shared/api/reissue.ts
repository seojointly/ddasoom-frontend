import axios from 'axios';
import type { ApiResponse } from '@/shared/types/api';
import type { AuthUser } from '@/shared/stores/authStore';
import type { Role } from '@/shared/types/role';

// Access Token 재발급 — single-flight.
//
// RT rotation(로테이션) 구조상 single-flight는 필수.
//   동시에 여러 요청이 401을 받아도 reissue 호출은 "단 하나"만 나가야 하며(진행 중이면 그 Promise를 공유),
//   중복 발사는 서버 grace(30초)가 흡수해 주지만 불필요한 회전을 만들 이유가 없다.
//   탭 간 동시 재발급 경합은 서버 grace 담당, "한 탭 안" 동시 401은 이 파일 담당 — 이중 방어.

/**
 * 로그인/재발급 공통 응답.
 * 백엔드: auth/dto/response/LoginResponse.java — accessToken, expiresIn(초), memberId, email, nickname, role
 * login(authApi.ts)과 reissue가 동일 DTO를 재사용한다(백엔드 설계).
 */
export interface AuthSessionResult {
  accessToken: string;
  expiresIn: number; // AT 유효시간(초) — 1800 = 30분
  memberId: number;
  email: string;
  nickname: string;
  role: Role;
}

/** 응답 → authStore.user 매핑 (email은 스토어에 보관하지 않음 — AuthUser 스펙) */
export function toAuthUser(result: AuthSessionResult): AuthUser {
  return { memberId: result.memberId, nickname: result.nickname, role: result.role };
}

// 진행 중인 reissue Promise — 모듈 스코프에 보관해 동시 호출을 하나로 합친다(single-flight 핵심).
let inflight: Promise<AuthSessionResult> | null = null;

/**
 * POST /api/auth/reissue — RT 쿠키 기반 AT 재발급.
 * ⚠️ axiosInstance가 아닌 bare axios를 쓴다:
 *    axiosInstance의 401 응답 인터셉터가 reissue 자체의 401을 다시 잡으면 무한 루프가 되므로,
 *    인터셉터가 없는 전용 호출로 원천 차단한다. (프록시 경유를 위해 '/api' 절대경로 직접 명시)
 * 실패(RT 만료/불일치 = AUTH_104)는 그대로 throw — 호출자(인터셉터/부트스트랩)가 로그아웃 처리.
 */
export function reissueAccessToken(): Promise<AuthSessionResult> {
  if (inflight) {
    return inflight; // 이미 재발급 진행 중 → 그 결과를 공유
  }

  inflight = axios
    .post<ApiResponse<AuthSessionResult>>('/api/auth/reissue', null, { withCredentials: true })
    .then((res) => res.data.data as AuthSessionResult)
    .finally(() => {
      inflight = null; // 성공/실패와 무관하게 다음 재발급을 위해 초기화
    });

  return inflight;
}