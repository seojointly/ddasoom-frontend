import { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useAdminFaq,
  useCreateFaq,
  useUpdateFaq,
  useFaqCategories,
} from '@/features/admin/hooks/useFaqs';
import { RichTextEditor, type RichTextEditorHandle } from '@/shared/components/editor';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';

// category/question만 폼(RHF)으로 검증한다. answer는 RichTextEditor가 ref(getPayload)로 조달하므로 폼 밖에서 관리.
// 백엔드 제약: question VARCHAR(255) NOT NULL, category Enum NOT NULL
const faqSchema = z.object({
  category: z.string().min(1, '카테고리를 선택해 주세요.'),
  question: z.string().min(1, '질문을 입력해 주세요.').max(255, '질문은 255자를 초과할 수 없습니다.'),
});
type FaqForm = z.infer<typeof faqSchema>;

export function AdminFaqFormPage() {
  const navigate = useNavigate();
  const { faqId } = useParams();
  const isEdit = faqId != null;
  const numericId = isEdit ? Number(faqId) : null;

  const { data: faq } = useAdminFaq(numericId);
  const { data: categories } = useFaqCategories();
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq();

  const editorRef = useRef<RichTextEditorHandle>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FaqForm>({
    resolver: zodResolver(faqSchema),
    defaultValues: { category: '', question: '' },
    values: isEdit && faq ? { category: faq.category, question: faq.question } : undefined,
  });

  const onSubmit = async (form: FaqForm) => {
    if (!editorRef.current) return;

    // 1. 미업로드 이미지 업로드 → 확정 HTML + imageIds. 실패 토스트는 에디터가 표시하므로 여기선 return만.
    let payload;
    try {
      payload = await editorRef.current.getPayload();
    } catch {
      return;
    }

    // 2. FAQ 생성/수정
    try {
      if (isEdit && numericId != null) {
        await updateFaq.mutateAsync({
          faqId: numericId,
          payload: {
            category: form.category,
            question: form.question,
            answer: payload.html,
            imageIds: payload.imageIds,
          },
        });
      } else {
        await createFaq.mutateAsync({
          category: form.category,
          question: form.question,
          answer: payload.html,
          imageIds: payload.imageIds,
        });
      }
    } catch {
      return; // mutation 실패 — 임시 blob은 유지(재시도 가능)
    }

    // 3. 저장 성공 후 임시 blob 정리 (누락 시 IndexedDB에 blob 누적)
    await editorRef.current.cleanup();

    navigate('/admin/faqs');
  };

  const isSubmitting = createFaq.isPending || updateFaq.isPending;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">{isEdit ? 'FAQ 수정' : '새 FAQ 작성'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-4">
        <div className="space-y-2">
          <Label htmlFor="category">카테고리</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="question">질문</Label>
          <Input id="question" {...register('question')} placeholder="질문을 입력하세요" />
          {errors.question && <p className="text-sm text-destructive">{errors.question.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>답변</Label>
          {/* 수정 모드는 기존 answer(HTML)를 initialHtml로 복원해야 하므로 로드 완료 후 마운트한다.
              RichTextEditor는 initialHtml을 첫 마운트 시점에만 읽기 때문. */}
          {isEdit && !faq ? (
            <div className="min-h-[280px] rounded-md border border-border p-4 text-sm text-muted-foreground">
              불러오는 중…
            </div>
          ) : (
            <RichTextEditor
              ref={editorRef}
              ownerType="FAQ"
              initialHtml={isEdit ? faq?.answer ?? '' : ''}
              placeholder="답변을 입력하세요"
            />
          )}
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isEdit ? '수정 완료' : '등록'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/admin/faqs')}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
}
