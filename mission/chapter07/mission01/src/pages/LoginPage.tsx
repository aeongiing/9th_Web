import { type UserSigninInformation, validateSignin } from "../utils/validate.ts";
import useForm from "../hooks/useForm";
import { useAuth } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login, accessToken } = useAuth();
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
    <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
        {/* 헤더 */}
        <h1 className="text-3xl font-bold text-white text-left">로그인</h1>

        {/* 구글 로그인 */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="flex items-center justify-center gap-2 w-full border border-gray-500 text-white py-3 rounded-md hover:bg-gray-700 transition"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          <span>Google로 로그인</span>
        </button>

        {/* 구분선 */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="flex-1 h-px bg-gray-600" />
          <span className="text-xs">또는</span>
          <div className="flex-1 h-px bg-gray-600" />
        </div>

        {/* 이메일 입력 */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">이메일</label>
          <input
            {...getInputProps("email")}
            type="email"
            placeholder="example@email.com"
            className={`w-full bg-gray-900 text-white border px-4 py-2 rounded-md placeholder-gray-500 focus:outline-none focus:border-blue-400
              ${
                errors?.email && touched?.email
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
          />
          {errors?.email && touched?.email && (
            <span className="text-red-500 text-sm">{errors.email}</span>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="flex flex-col gap-1">
          <label className="text-gray-300 text-sm">비밀번호</label>
          <input
            {...getInputProps("password")}
            type="password"
            placeholder="비밀번호를 입력해주세요"
            className={`w-full bg-gray-900 text-white border px-4 py-2 rounded-md placeholder-gray-500 focus:outline-none focus:border-blue-400
              ${
                errors?.password && touched?.password
                  ? "border-red-500"
                  : "border-gray-600"
              }`}
          />
          {errors?.password && touched?.password && (
            <span className="text-red-500 text-sm">{errors.password}</span>
          )}
        </div>

        {/* 로그인 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`w-full py-3 rounded-md text-lg font-semibold transition duration-200 
            ${
              isDisabled
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
            }`}
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;