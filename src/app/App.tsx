import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';

// 앱 루트 컴포넌트 — 라우터 연결(Part 2).
export function App() {
  return <RouterProvider router={router} />;
}
