import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 앱 전역 프로바이더(CLAUDE.md 3절 app/).
// Part 1: 서버 상태(TanStack Query) 프로바이더 골격만. RouterProvider 등은 Part 2에서 추가.
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
