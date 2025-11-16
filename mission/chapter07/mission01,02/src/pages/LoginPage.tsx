// src/pages/LoginPage.tsx
import { type UserSigninInformation, validateSignin } from "../utils/validate.ts";
import useForm from "../hooks/useForm";
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: {
        email: "",
        password: "",
      },
      validate: validateSignin,
    });

  const handleSubmit = async () => {
    await login(values);
    navigate("/my");
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value === "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            로그인
          </h1>
          <p className="text-gray-400">My LP에 오신 것을 환영합니다</p>
        </div>

        {/* 폼 카드 */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700/50">
          {/* 구글 로그인 */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="flex items-center justify-center gap-3 w-full border-2 border-gray-700 hover:border-gray-600 bg-gray-800/50 text-white py-3 rounded-xl hover:bg-gray-700/50 transition-all group"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            <span className="font-medium">Google로 로그인</span>
          </button>

          {/* 구분선 */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            <span className="text-gray-500 text-sm font-medium">또는</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
          </div>

          {/* 이메일 입력 */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Mail size={16} />
                이메일
              </label>
              <input
                {...getInputProps("email")}
                type="email"
                placeholder="example@email.com"
                className={`w-full bg-gray-900/50 text-white border ${
                  errors?.email && touched?.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                } px-4 py-3 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 transition-all`}
              />
              {errors?.email && touched?.email && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="text-lg">⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Lock size={16} />
                비밀번호
              </label>
              <input
                {...getInputProps("password")}
                type="password"
                placeholder="비밀번호를 입력해주세요"
                className={`w-full bg-gray-900/50 text-white border ${
                  errors?.password && touched?.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                } px-4 py-3 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 transition-all`}
              />
              {errors?.password && touched?.password && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="text-lg">⚠</span> {errors.password}
                </p>
              )}
            </div>

            {/* 로그인 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={isDisabled}
              className={`w-full py-3 rounded-xl text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2 mt-6
                ${
                  isDisabled
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/50"
                }`}
            >
              <LogIn size={20} />
              로그인
            </button>
          </div>

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              아직 계정이 없으신가요?{" "}
              <a
                href="/signup"
                className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
              >
                회원가입
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;