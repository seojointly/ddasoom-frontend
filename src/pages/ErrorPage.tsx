import { useEffect } from 'react';
import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

// 예상하지 못한 렌더 예외의 최후 방어선.
// 라우터의 errorElement로 등록되며(app/router.tsx), 하위 라우트 어디서 예외가 나든
// 트리 전체가 언마운트되는 대신 이 화면이 대신 렌더된다.
//
// - 서버 응답 에러(로딩/실패)는 각 페이지가 TanStack Query의 isError로 이미 처리한다.
//   이 경계가 잡는 것은 "널 참조 / 응답 형태 불일치" 같은 렌더 중 예외다.
// - errorElement는 라우트 이동 시 자동으로 초기화되므로, 홈으로 이동하면 정상 복구된다.
// - 에러 상세는 개발 환경에서만 노출한다 (사용자에게 스택/내부 메시지 노출 금지).
export function ErrorPage() {
  const error = useRouteError();

  // 데모 중 원인 추적을 위해 콘솔에는 항상 남긴다.
  useEffect(() => {
    console.error('[ErrorPage] 처리되지 않은 렌더 예외', error);
  }, [error]);

  return (
    <div className='flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 bg-secondary px-4 text-center'>
      <div className='flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10'>
        <AlertTriangle size={28} className='text-destructive' />
      </div>
      <h1 className='text-2xl font-bold text-foreground'>문제가 발생했어요</h1>
      <p className='max-w-sm text-base text-muted-foreground'>
        화면을 그리는 중 오류가 생겼어요. 새로고침하거나 홈으로 돌아가 주세요.
      </p>

      {import.meta.env.DEV && (
        <pre className='max-w-lg overflow-x-auto rounded-md bg-background p-3 text-left text-xs text-muted-foreground'>
          {describeError(error)}
        </pre>
      )}

      <div className='mt-2 flex gap-2'>
        <button
          type='button'
          onClick={() => window.location.reload()}
          className='rounded-xl bg-ring px-6 py-2.5 text-base font-bold text-white transition-all hover:brightness-105'
        >
          새로고침
        </button>
        <Link
          to='/'
          className='rounded-xl border border-border bg-background px-6 py-2.5 text-base font-bold text-foreground transition-all hover:brightness-95'
        >
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}

// 개발 환경 표시용 요약. 라우터가 던진 Response(4xx/5xx)와 일반 예외를 구분한다.
function describeError(error: unknown): string {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`;
  if (error instanceof Error) return error.message;
  return String(error);
}
