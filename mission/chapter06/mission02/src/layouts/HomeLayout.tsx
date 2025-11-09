import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function HomeLayout() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const nickname = localStorage.getItem('nickname');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('nickname');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* 헤더 */}
      <nav className="flex justify-between items-center px-6 h-14 border-b border-neutral-800 sticky top-0 bg-black z-50">
        <h1 className="text-fuchsia-500 font-extrabold tracking-tight text-lg">
          LP Gallery
        </h1>
        <div className="flex gap-2 items-center">
          {isLoggedIn ? (
            <>
              <span className="text-sm">{nickname}님 반갑습니다.</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm rounded-md border border-neutral-600 hover:bg-neutral-800 transition"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1 text-sm rounded-md border border-neutral-600 hover:bg-neutral-800 transition"
              >
                로그인
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-3 py-1 text-sm rounded-md bg-fuchsia-600 hover:bg-fuchsia-500 text-white transition"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </nav>

      {/* 메인 레이아웃 */}
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}