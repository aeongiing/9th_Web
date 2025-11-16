// src/components/Navbar.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import useLogout from "../hooks/mutation/useLogout";
import { Menu, LogOut, User } from "lucide-react";

const Navbar = () => {
  const { accessToken } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { data: userData } = useGetMyInfo();
  const { mutate: logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-40 shadow-lg">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
          {/* 왼쪽 - 메뉴 + 로고 */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-300 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hover:from-blue-300 hover:to-purple-300 transition-all"
            >
              My LP
            </Link>
          </div>

          {/* 오른쪽 - 로그인/유저 정보 */}
          <div className="flex items-center gap-4">
            {accessToken ? (
              <>
                {userData?.data.name && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg">
                    <User size={18} className="text-blue-400" />
                    <span className="text-gray-200 font-medium">
                      {userData.data.name}님
                    </span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition-all border border-gray-700 hover:border-gray-600"
                >
                  <LogOut size={18} />
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-blue-500/50"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;