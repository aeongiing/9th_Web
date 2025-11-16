import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";

const Navbar = () => {
  const { accessToken, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const { data: userData } = useGetMyInfo();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <nav className="bg-white dark:bg-gray-900 shadow-md w-full z-10 sm:px-4 py-2.5 dark:border-gray-700">
        <div className="flex items-center justify-between max-w-screen-xxl mx-auto p-4">

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-900 dark:text-white text-2xl focus:outline-none"
            >
              ☰
            </button>
            <Link
              to="/"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              My LP
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {accessToken ? (
              <>
                {userData?.data.name && (
                  <span className="text-gray-900 dark:text-white font-medium">
                    {userData.data.name}님 반갑습니다.
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-1 rounded border border-gray-300 dark:border-white 
             text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 
             transition-colors duration-200"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-900 dark:text-white hover:underline"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-900 dark:text-white hover:underline"
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