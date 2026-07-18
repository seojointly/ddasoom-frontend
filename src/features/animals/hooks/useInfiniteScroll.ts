import { useEffect, useRef } from 'react';

// 무한스크롤 감지 훅 — 반환한 ref를 리스트 끝 sentinel 요소에 달면,
// 그 요소가 뷰포트에 근접(rootMargin 200px)할 때 onIntersect를 호출한다.
// enabled=false면 관찰하지 않는다(다음 페이지 없음/로딩 중일 때 중복 호출 방지).
export function useInfiniteScroll(
  onIntersect: () => void,
  enabled: boolean,
) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  // 최신 콜백을 ref로 들고 있어, onIntersect 재생성이 옵저버를 재구독시키지 않게 함
  const callbackRef = useRef(onIntersect);
  callbackRef.current = onIntersect;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callbackRef.current();
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return sentinelRef;
}
