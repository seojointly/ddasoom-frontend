import { useNavigate, useParams } from 'react-router-dom';
import { useFaq, useFaqCategories } from '@/features/support/hooks/useFaqs';
import { SafeHtmlViewer } from '@/shared/components/editor';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';

export function FaqDetailPage() {
  const navigate = useNavigate();
  const { faqId } = useParams<{ faqId: string }>();
  const parsedId = faqId != null ? Number(faqId) : null;

  const { data, isLoading, isError } = useFaq(parsedId);
  const { data: categories } = useFaqCategories();

  const categoryLabel = (value: string) =>
    categories?.find((c) => c.value === value)?.label ?? value;

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">불러오는 중…</div>;
  }
  // 존재하지 않거나 비노출/삭제 FAQ → 백엔드 404
  if (isError || !data) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="p-8 text-center text-muted-foreground">FAQ를 찾을 수 없습니다.</div>
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => navigate('/support/faqs')}>
            목록으로
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* 크림색 페이지 배경 위 흰 카드로 본문 가독성 확보 */}
      <Card className="gap-0 p-6 shadow-sm md:p-8">
        <Badge variant="secondary" className="mb-3 w-fit">
          #{categoryLabel(data.category)}
        </Badge>
        <h1 className="mb-6 text-2xl font-semibold">
          <span className="mr-1 text-primary">Q</span>
          {data.question}
        </h1>

        <SafeHtmlViewer html={data.answer} className="min-h-40 border-t pt-6" />
      </Card>

      <div className="mt-8 flex justify-center">
        <Button variant="outline" onClick={() => navigate('/support/faqs')}>
          목록으로
        </Button>
      </div>
    </div>
  );
}
