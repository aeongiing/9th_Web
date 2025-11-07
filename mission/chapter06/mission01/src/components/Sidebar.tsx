import { NavLink } from 'react-router-dom';
import { useState } from 'react';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 버거 버튼 (모바일) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[1001] md:hidden text-white"
      >
        <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32"/>
        </svg>
      </button>

      {/* 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[999] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-neutral-900 p-6 z-[1000]
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 text-white text-2xl"
        >
          ✕
        </button>

        <nav className="flex flex-col gap-4 mt-12 md:mt-0">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2 rounded transition ${
                isActive ? 'bg-fuchsia-600 text-white' : 'hover:bg-neutral-800'
              }`
            }
          >
            홈
          </NavLink>
          <NavLink
            to="/lps"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `px-4 py-2 rounded transition ${
                isActive ? 'bg-fuchsia-600 text-white' : 'hover:bg-neutral-800'
              }`
            }
          >
            LP 목록
          </NavLink>
        </nav>
      </aside>
    </>
  );
}