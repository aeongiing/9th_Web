// src/pages/SignupPage.tsx
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSignup } from "../apis/auth";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User as UserIcon, CheckCircle } from "lucide-react";

const schema = z
  .object({
    email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
      }),
    passwordCheck: z
      .string()
      .min(8, {
        message: "비밀번호는 8자 이상이어야 합니다.",
      })
      .max(20, {
        message: "비밀번호는 20자 이하여야 합니다.",
      }),
    name: z.string().min(1, { message: "이름을 입력하세요." }),
  })
  .refine((data) => data.password === data.passwordCheck, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordCheck"],
  });

type FormFields = z.infer<typeof schema>;

const SignupPage = () => {
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { passwordCheck, ...rest } = data;
    try {
      const response = await postSignup(rest);
      console.log("회원가입 성공", response);
      alert("회원가입이 완료되었습니다!");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패", error);
      alert("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            회원가입
          </h1>
          <p className="text-gray-400">My LP와 함께 시작하세요</p>
        </div>

        {/* 폼 카드 */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* 이름 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <UserIcon size={16} />
                이름
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="이름을 입력하세요"
                className={`w-full bg-gray-900/50 text-white border ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                } px-4 py-3 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 transition-all`}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="text-lg">⚠</span> {errors.name.message}
                </p>
              )}
            </div>

            {/* 이메일 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Mail size={16} />
                이메일
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="example@email.com"
                className={`w-full bg-gray-900/50 text-white border ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                } px-4 py-3 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 transition-all`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="text-lg">⚠</span> {errors.email.message}
                </p>
              )}
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <Lock size={16} />
                비밀번호
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="8-20자 사이로 입력하세요"
                className={`w-full bg-gray-900/50 text-white border ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                } px-4 py-3 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 transition-all`}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="text-lg">⚠</span> {errors.password.message}
                </p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <CheckCircle size={16} />
                비밀번호 확인
              </label>
              <input
                {...register("passwordCheck")}
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                className={`w-full bg-gray-900/50 text-white border ${
                  errors.passwordCheck
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-gray-700 focus:border-blue-500 focus:ring-blue-500/20"
                } px-4 py-3 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 transition-all`}
              />
              {errors.passwordCheck && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <span className="text-lg">⚠</span> {errors.passwordCheck.message}
                </p>
              )}
            </div>

            {/* 회원가입 버튼 */}
            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full py-3 rounded-xl text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  가입 중...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  회원가입
                </>
              )}
            </button>
          </form>

          {/* 로그인 링크 */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              이미 계정이 있으신가요?{" "}
              <a
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium hover:underline"
              >
                로그인
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;