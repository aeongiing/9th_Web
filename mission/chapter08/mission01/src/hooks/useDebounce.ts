import { useEffect, useState } from "react";

/**
 * useDebounce Hook
 * 입력 값을 지정된 지연 시간만큼 debounce하여 반환.
 * 
 * @param value - debounce할 값
 * @param delay - 지연 시간 (밀리초)
 * @returns 지연된 값
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    console.log(`[useDebounce] 입력 값 변경: "${value}" (${delay}ms 대기 중...)`);
    
    // 타이머 설정: delay 시간 후 debouncedValue 업데이트
    const timer = setTimeout(() => {
      console.log(`[useDebounce] ${delay}ms 경과 - API 요청 가능 상태: "${value}"`);
      setDebouncedValue(value);
    }, delay);

    // 클린업 함수: 컴포넌트 언마운트 또는 value/delay 변경 시 타이머 제거
    return () => {
      console.log(`[useDebounce] 타이머 정리 (새로운 입력 또는 언마운트)`);
      clearTimeout(timer);
    };
  }, [value, delay]); // value나 delay가 변경될 때마다 effect 재실행

  return debouncedValue;
}

export default useDebounce;