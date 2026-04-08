import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// 여러 스타일 이름을 하나로 합쳐 화면 모양 충돌을 줄입니다.
// 같은 항목에 겹치는 스타일이 들어와도 마지막 의도를 반영해
// 버튼/카드 UI가 예상과 다르게 깨지는 상황을 예방합니다.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
