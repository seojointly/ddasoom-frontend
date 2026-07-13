import { Link } from 'react-router-dom';
import { PawPrint} from 'lucide-react';

// 전역 푸터 — 피그마 메인 디자인 이식.
// 다크 브라운 계열은 테마 토큰에 없는 푸터 전용 색이라 arbitrary value로 이 파일 안에서만 사용한다.
const FOOTER_COLUMNS = [
  { title: '서비스', links: ['서비스 소개', '입양 아이들', '입양 후기', '봉사/후원'] },
  { title: '고객지원', links: ['자주 묻는 질문', '공지사항', '문의하기', '이용약관'] },
  { title: '파트너', links: ['보호소 등록', '파트너 안내', '제휴 문의'] },
  { title: '연락처', links: ['02-1234-5678', 'help@ttasum.kr', '서울 마포구 합정동'] },
];

export function Footer() {
  return (
    <footer className="bg-[#2F2618] py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* 브랜드 */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <PawPrint size={15} className="text-white" />
              </div>
              {/* [타이포] text-lg → text-xl (헤더 로고와 통일) */}
              <span className="text-xl font-bold text-accent">따숨</span>
            </div>
            {/* [타이포] text-xs → text-sm */}
            <p className="text-sm leading-relaxed text-[#7A6A58]">
              유기동물 입양 플랫폼 따숨은
              <br />새 가족을 기다리는 아이들과
              <br />좋은 가족을 연결합니다.
            </p>
          </div>

          {/* 링크 컬럼 4개 */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              {/* [타이포] text-sm → text-base */}
              <h4 className="mb-3 text-base font-semibold text-[#EED9B6]">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    {/* [타이포] text-xs → text-sm */}
                    <a href="#" className="text-sm text-[#7A6A58] transition-colors hover:text-primary">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-[#3D3020] pt-6 md:flex-row">
          {/* [타이포] text-xs → text-sm */}
          <p className="text-sm text-[#5A4A38]">© 2026 따숨. All rights reserved.</p>
          {/* [타이포] text-xs → text-sm */}
          <div className="flex gap-4 text-sm text-[#5A4A38]">
            <Link to="#">개인정보처리방침</Link>
            <Link to="#">이용약관</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}