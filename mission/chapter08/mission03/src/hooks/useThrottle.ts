import { useCallback, useRef } from "react";

/**
 * useThrottle Hook
 * 함수 실행을 일정 시간 간격으로 제한.
 * 
 * @param callback - throttle할 함수
 * @param delay - 최소 실행 간격 (밀리초)
 * @returns throttle이 적용된 함수
 */
function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  // 마지막 실행 시간을 추적
  const lastRunRef = useRef<number>(0);
  // 대기 중인 타이머 ID를 추적
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const throttledFunction = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastRun = now - lastRunRef.current;

      // 첫 실행이거나 delay 시간이 지났으면 즉시 실행
      if (timeSinceLastRun >= delay) {
        console.log(`[useThrottle] 즉시 실행 (마지막 실행 후 ${timeSinceLastRun}ms 경과)`);
        callback(...args);
        lastRunRef.current = now;
      } else {
        // delay 시간이 지나지 않았으면 대기
        const remainingTime = delay - timeSinceLastRun;
        console.log(`[useThrottle] 실행 대기 중 (${remainingTime}ms 후 실행 가능)`);

        // 이전 타이머가 있으면 취소
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        // 남은 시간 후에 실행되도록 타이머 설정
        timerRef.current = setTimeout(() => {
          console.log(`[useThrottle] 지연 실행 (${delay}ms 경과)`);
          callback(...args);
          lastRunRef.current = Date.now();
          timerRef.current = null;
        }, remainingTime);
      }
    },
    [callback, delay]
  );

  return throttledFunction;
}

export default useThrottle;