import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import { Toaster } from '@/shared/components/ui/sonner';

// 앱 루트 컴포넌트 — 라우터 연결.
export function App() {
  return(
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          duration: 4000, // 기본 3초 → 4초
          style: { fontSize: '1rem', padding: '16px 20px' }, // 본문 크기·여백 확대
        }}
      />
    </>
  );
}
