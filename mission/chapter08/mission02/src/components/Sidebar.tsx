// src/components/Sidebar.tsx
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useDeleteUser from "../hooks/mutation/useDeleteUser";
import { Home, User, Search, LogOut, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { mutate: deleteAccount } = useDeleteUser();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleDeleteAccount = () => {
    if (window.confirm("정말 탈퇴하시겠습니까?")) {
      deleteAccount();
    }
  };

  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl z-50 transform transition-transform duration-300 border-r border-gray-700/50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700/50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            메뉴
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* 메뉴 목록 */}
        <nav className="flex flex-col p-4 space-y-2">
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 rounded-lg transition-all group border border-transparent hover:border-blue-500/20"
            onClick={onClose}
          >
            <Home size={20} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
            <span className="text-gray-300 group-hover:text-white transition-colors">홈</span>
          </Link>

          <Link 
            to="/my" 
            className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 rounded-lg transition-all group border border-transparent hover:border-blue-500/20"
            onClick={onClose}
          >
            <User size={20} className="text-gray-400 group-hover:text-purple-400 transition-colors" />
            <span className="text-gray-300 group-hover:text-white transition-colors">마이페이지</span>
          </Link>

          <Link 
            to="/search" 
            className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 rounded-lg transition-all group border border-transparent hover:border-blue-500/20"
            onClick={onClose}
          >
            <Search size={20} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
            <span className="text-gray-300 group-hover:text-white transition-colors">검색</span>
          </Link>
        </nav>

        {/* 하단 - 탈퇴 버튼 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
          <button
            onClick={handleDeleteAccount}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3 rounded-lg transition-all shadow-lg hover:shadow-red-500/50 font-medium"
          >
            <LogOut size={18} />
            회원 탈퇴
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;