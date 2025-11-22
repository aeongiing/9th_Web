// src/pages/MyPage.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import usePatchMyInfo from "../hooks/mutation/usePatchMyInfo";
import useGetMyLpList from "../hooks/queries/useGetMyLpList";
import { PAGINATION_ORDER } from "../enums/common";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import CreateLpModal from "../components/LpCard/CreateLpModal";
import { Settings, Plus, Save, X, User, Mail, FileText } from "lucide-react";

const MyPage = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { data, isLoading } = useGetMyInfo();
  const patchMyInfoMutation = usePatchMyInfo();

  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [avatarInput, setAvatarInput] = useState("");

  useEffect(() => {
    if (data) {
      if (data.data.name !== nameInput) setNameInput(data.data.name);
      if (data.data.bio !== bioInput) setBioInput(data.data.bio ?? "");
      if (data.data.avatar !== avatarInput)
        setAvatarInput(data.data.avatar ?? "");
    }
  }, [data]);

  useEffect(() => {
    if (!isLoading && !data) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [isLoading, data, navigate]);

  const {
    data: lps,
    isFetching,
    isPending,
    fetchNextPage,
    hasNextPage,
    isError,
  } = useGetMyLpList(10, PAGINATION_ORDER.desc, "");

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  const handleSave = () => {
    patchMyInfoMutation.mutate({
      name: nameInput,
      bio: bioInput,
      avatar: avatarInput,
    });
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* 프로필 섹션 */}
        {data && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 mb-8 border border-gray-700/50">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* 프로필 이미지 */}
              <div className="flex-shrink-0">
                {avatarInput ? (
                  <img
                    key={avatarInput}
                    src={avatarInput}
                    alt="프로필"
                    className="w-32 h-32 object-cover rounded-full border-4 border-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-4xl font-bold shadow-lg border-4 border-gray-700">
                    {data.data.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* 프로필 정보 */}
              <div className="flex-1 w-full">
                {editMode ? (
                  <div className="space-y-4">
                    {/* 이름 수정 */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                        <User size={16} />
                        이름
                      </label>
                      <input
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="w-full bg-gray-900/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-lg transition-all outline-none"
                      />
                    </div>

                    {/* Bio 수정 */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                        <FileText size={16} />
                        소개
                      </label>
                      <textarea
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        placeholder="자기소개를 입력하세요"
                        rows={3}
                        className="w-full bg-gray-900/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-lg transition-all outline-none resize-none"
                      />
                    </div>

                    {/* 프로필 이미지 URL */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                        <User size={16} />
                        프로필 이미지 URL
                      </label>
                      <input
                        value={avatarInput}
                        onChange={(e) => setAvatarInput(e.target.value)}
                        placeholder="https://example.com/avatar.jpg"
                        className="w-full bg-gray-900/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-lg transition-all outline-none"
                      />
                    </div>

                    {/* 버튼 */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-all shadow-lg"
                      >
                        <Save size={18} />
                        저장
                      </button>
                      <button
                        onClick={() => setEditMode(false)}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                      >
                        <X size={18} />
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                          {data.data.name}
                        </h1>
                        <p className="flex items-center gap-2 text-gray-400 mb-3">
                          <Mail size={16} />
                          {data.data.email}
                        </p>
                      </div>
                      <button
                        onClick={() => setEditMode(true)}
                        className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all border border-gray-700 hover:border-gray-600 group"
                        title="프로필 수정"
                      >
                        <Settings className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                      </button>
                    </div>
                    {data.data.bio && (
                      <p className="text-gray-300 text-base leading-relaxed bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                        {data.data.bio}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* LP 목록 섹션 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="text-blue-400" />
            내가 작성한 LP
          </h2>
        </div>

        {isError ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">LP 목록을 불러오는데 오류가 발생했습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isPending && <LpCardSkeletonList count={8} />}
            {lps?.pages
              ?.map((page) => page.data.data)
              ?.flat()
              ?.map((lp) => (
                <LpCard key={lp.id} lp={lp} />
              ))}
            {isFetching && <LpCardSkeletonList count={8} />}
          </div>
        )}

        <div ref={ref} className="h-2" />

        {/* 우측 하단 + 버튼 */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all z-50 flex items-center justify-center group hover:scale-110"
          title="새 LP 만들기"
        >
          <Plus size={32} className="group-hover:rotate-90 transition-transform" />
        </button>

        {showCreateModal && (
          <CreateLpModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    </div>
  );
};

export default MyPage;