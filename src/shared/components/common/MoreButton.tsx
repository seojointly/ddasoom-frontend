// 섹션 공용 "더보기" 버튼 — 피그마 MoreButton 원형: 테두리 pill, hover 시 골드로 전환
export function MoreButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-border px-8 py-2.5 text-base font-semibold text-muted-foreground transition-colors hover:border-ring hover:text-ring"
    >
      {label}
    </button>
  );
}