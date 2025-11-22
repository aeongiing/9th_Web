// src/hooks/useSidebar.ts
import { useState, useEffect, useCallback } from "react";

/**
 * useSidebar Hook
 * Sidebar의 열림/닫힘 상태를 관리하는 커스텀 훅
 * 
 * @returns {Object} Sidebar 상태 및 제어 함수들
 */
export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  /**
   * Sidebar 열기
   */
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Sidebar 닫기
   */
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Sidebar 토글 (열림 ↔ 닫힘)
   */
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /**
   * ESC 키 이벤트 핸들러
   * ESC 키를 누르면 Sidebar 닫기
   */
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        console.log("[useSidebar] ESC 키 감지 - Sidebar 닫기");
        close();
      }
    };

    // Sidebar가 열려있을 때만 이벤트 리스너 등록
    if (isOpen) {
      window.addEventListener("keydown", handleEscKey);
      console.log("[useSidebar] ESC 키 이벤트 리스너 등록");
    }

    // 클린업 함수: 이벤트 리스너 제거하여 메모리 누수 방지
    return () => {
      window.removeEventListener("keydown", handleEscKey);
      console.log("[useSidebar] ESC 키 이벤트 리스너 제거");
    };
  }, [isOpen, close]);

  /**
   * 배경 스크롤 방지
   * Sidebar가 열려있을 때 body의 스크롤을 비활성화
   */
  useEffect(() => {
    if (isOpen) {
      // Sidebar가 열릴 때: 스크롤 방지
      console.log("[useSidebar] 배경 스크롤 비활성화");
      document.body.style.overflow = "hidden";
    } else {
      // Sidebar가 닫힐 때: 스크롤 복원
      console.log("[useSidebar] 배경 스크롤 활성화");
      document.body.style.overflow = "auto";
    }

    // 클린업 함수: 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = "auto";
      console.log("[useSidebar] 클린업 - 배경 스크롤 복원");
    };
  }, [isOpen]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
};