import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { AuthCard } from '@/features/auth/components/AuthCard';
import { completeSocialSignup, checkNicknameAvailable } from '@/features/auth/api/authApi';
import { reissueAccessToken, toAuthUser } from '@/shared/api/reissue';
import { useAuthStore } from '@/shared/stores/authStore';
import { Input } from '@/shared/components/ui/input';

// 소셜 가입 추가정보 입력 (GUEST 전용 — 라우터의 RequireGuest 가드가 접근 통제).
// 제출 성공 → reissue 1회(role claim 갱신 — 백엔드 설계상 필수) → USER로 홈 진입.
// 검증 규칙은 백엔드 SocialExtraInfoRequest의 @Pattern과 1:1 동일하게 유지한다.
const socialSignupSchema = z.object({
  name: z
    .string()
    .min(2, '이름은 2자 이상이어야 합니다.')
    .max(50, '이름은 50자 이하여야 합니다.')
    .refine(
      (value) => /^[가-힣]+$/.test(value) || /^[a-zA-Z\s]+$/.test(value),
      '이름은 한글 또는 영문만 입력할 수 있습니다.',
    ),
  nickname: z
    .string()
    .regex(/^[a-zA-Z0-9가-힣]{2,10}$/, '닉네임은 2~10자의 한글, 영문, 숫자만 가능합니다.'),
  tel: z
    .string()
    .regex(/^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/, "휴대폰 번호는 01로 시작하며 '-' 없이 10~11자리여야 합니다."),
});
type SocialSignupForm = z.infer<typeof socialSignupSchema>;

export function SocialSignupPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 닉네임 중복확인 상태: 미확인 → checking → available/taken. 값이 바뀌면 미확인으로 리셋
  const [nicknameStatus, setNicknameStatus] = useState<'unchecked' | 'checking' | 'available' | 'taken'>('unchecked');

  const {
    register, handleSubmit, getValues, trigger,
    formState: { errors },
  } = useForm<SocialSignupForm>({ resolver: zodResolver(socialSignupSchema) });

  /** 닉네임 중복확인 — 형식 검증(zod) 통과 후에만 API 호출 (팀 규칙) */
  const handleCheckNickname = async () => {
    const isValid = await trigger('nickname');
    if (!isValid) return;

    setNicknameStatus('checking');
    try {
      const available = await checkNicknameAvailable(getValues('nickname'));
      setNicknameStatus(available ? 'available' : 'taken');
    } catch {
      setNicknameStatus('unchecked');
      toast.error('중복 확인 중 문제가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const onSubmit = async (form: SocialSignupForm) => {
    if (nicknameStatus !== 'available') {
      toast.warning('닉네임 중복 확인을 해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await completeSocialSignup(form);

      // ★ 승급 후 reissue 필수 — 새 AT를 받아야 role claim이 USER가 된다 (기존 AT는 GUEST인 채 유효)
      const result = await reissueAccessToken();
      setAuth(result.accessToken, toAuthUser(result));

      toast.success(`${result.nickname}님, 가입을 환영해요! 🐾`);
      navigate('/', { replace: true });
    } catch (error) {
      // 중복확인 통과 후 타인이 선점한 경우(TOCTOU) — 백엔드 재검사가 잡아준다
      if (isAxiosError(error) && error.response?.data?.code === 'AUTH_002') {
        setNicknameStatus('taken');
        toast.error('방금 다른 분이 사용한 닉네임이에요. 다른 닉네임을 입력해 주세요.');
      } else {
        toast.error('가입 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard title="추가 정보 입력" description="따숨 가입이 거의 끝났어요! 몇 가지만 더 알려주세요">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <Input
            placeholder="이름 (실명)"
            autoComplete="name"
            className="!h-12 rounded-xl border-border bg-secondary px-4 text-base"
            {...register('name')}
          />
          {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
        </div>

        {/* 닉네임 + 중복확인 버튼 */}
        <div>
          <div className="flex gap-2">
            <Input
              placeholder="닉네임 (2~10자)"
              className="!h-12 flex-1 rounded-xl border-border bg-secondary px-4 text-base"
              {...register('nickname', {
                onChange: () => setNicknameStatus('unchecked'), // 값 변경 시 재확인 필요
              })}
            />
            <button
              type="button"
              onClick={handleCheckNickname}
              disabled={nicknameStatus === 'checking'}
              className="shrink-0 rounded-xl border border-ring/40 bg-secondary px-4 text-sm font-semibold text-ring transition-colors hover:bg-ring hover:text-white disabled:opacity-60"
            >
              {nicknameStatus === 'checking' ? '확인 중…' : '중복 확인'}
            </button>
          </div>
          {errors.nickname && <p className="mt-1 text-sm text-destructive">{errors.nickname.message}</p>}
          {nicknameStatus === 'available' && <p className="mt-1 text-sm text-[#5BA97B]">사용 가능한 닉네임이에요.</p>}
          {nicknameStatus === 'taken' && <p className="mt-1 text-sm text-destructive">이미 사용 중인 닉네임이에요.</p>}
        </div>

        <div>
          <Input
            type="tel"
            placeholder="휴대폰 번호 ('-' 없이 숫자만)"
            autoComplete="tel"
            className="!h-12 rounded-xl border-border bg-secondary px-4 text-base"
            {...register('tel')}
          />
          {errors.tel && <p className="mt-1 text-sm text-destructive">{errors.tel.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-ring py-3 text-base font-bold text-white transition-all hover:brightness-105 disabled:opacity-60"
        >
          {isSubmitting ? '가입 완료 중…' : '가입 완료하기'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        입력하신 정보는 임시보호 신청 등 서비스 이용에 사용돼요.
      </p>
    </AuthCard>
  );
}