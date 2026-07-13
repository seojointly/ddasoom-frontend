import { useNavigate } from 'react-router-dom';
import { UserCircle2 } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';

// GUEST가 로그인 필요 페이지(RequireAuth)에 진입했을 때 뜨는 차단 모달.
// 항상 open=true — 이 화면 자체가 이 모달의 존재 이유라 닫기(취소) 동작은 두지 않고,
// "추가정보 입력하러 가기"만 제공해 다음 행동을 명확히 안내한다.
export function IncompleteProfileGate() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-secondary">
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <UserCircle2 size={22} className="text-ring" /> 추가정보 입력이 필요해요
            </AlertDialogTitle>
            <AlertDialogDescription>
              소셜 가입을 완료하려면 이름·닉네임·연락처를 먼저 입력해 주셔야
              이 기능을 이용하실 수 있어요.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate('/signup/social')}>
              추가정보 입력하러 가기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}