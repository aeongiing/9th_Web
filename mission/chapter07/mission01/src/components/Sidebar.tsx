import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteUser } from "../apis/auth";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

 
  const handleDeleteAccount = async () => {
    if (window.confirm("정말 탈퇴하시겠습니까?")) {
      try {
        await deleteUser();
        alert("회원 탈퇴가 완료되었습니다.");
        navigate("/");
      } catch (error) {
        console.error("회원 탈퇴 실패:", error);
        alert("회원 탈퇴 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 z-50
      transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">메뉴</h2>
        <button onClick={onClose} className="text-white text-lg">
          ✖
        </button>
      </div>
      <nav className="flex flex-col space-y-4 mb-4">
        <Link to="/my" className="hover:bg-gray-700 p-2 rounded">
          마이페이지
        </Link>
        <Link to="/search" className="hover:bg-gray-700 p-2 rounded">
          검색
        </Link>
      </nav>
      <div className="mt-auto">
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 hover:bg-red-700 w-full p-2 rounded text-sm"
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default Sidebar;