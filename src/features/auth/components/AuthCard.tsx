import { PawPrint } from 'lucide-react';

// 인증 화면 공용 카드 — 크림 배경 + 중앙 흰 카드 (메인 검색바와 동일 재질).
// 인증 계열 5개 페이지(로그인/가입/추가정보/재설정/콜백)가 전부 이 틀을 쓴다.
export function AuthCard({ title, description, children }: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <PawPrint size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {description && <p className="text-center text-sm text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}