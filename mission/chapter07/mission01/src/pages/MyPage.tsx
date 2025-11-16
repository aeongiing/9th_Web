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
import { Settings } from "lucide-react";

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
      // 이미 값이 같다면 굳이 다시 setState 하지 않기
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

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-4 py-6">
      {data && (
        <div className="flex items-start justify-between mb-10">
          <div className="flex gap-4 items-center w-full">
            {data.data.avatar ? (
              <img
                key={avatarInput}
                src={avatarInput}
                alt="프로필"
                className="w-24 h-24 object-cover rounded-full border border-neutral-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-neutral-700 flex items-center justify-center text-2xl font-bold">
                {data.data.name.charAt(0)}
              </div>
            )}

            <div className="flex-1">
              {editMode ? (
                <>
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="text-2xl font-bold bg-neutral-800 text-white border border-neutral-700 p-2 rounded w-full mb-2"
                  />
                  <textarea
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    placeholder="소개를 입력하세요"
                    className="text-sm bg-neutral-800 text-white border border-neutral-700 p-2 rounded w-full mb-2"
                  />
                  <input
                    value={avatarInput}
                    onChange={(e) => setAvatarInput(e.target.value)}
                    placeholder="프로필 이미지 URL"
                    className="text-sm bg-neutral-800 text-white border border-neutral-700 p-2 rounded w-full mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        patchMyInfoMutation.mutate({
                          name: nameInput,
                          bio: bioInput,
                          avatar: avatarInput,
                        });
                        setEditMode(false);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="bg-neutral-700 px-4 py-2 rounded"
                    >
                      취소
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold mb-1">{data.data.name}</h1>
                  <p className="text-sm text-neutral-400 mb-2">
                    {data.data.email}
                  </p>
                  {data.data.bio && (
                    <p className="text-sm text-neutral-300 italic">
                      {data.data.bio}
                    </p>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => setEditMode((prev) => !prev)}
              className="text-neutral-400 hover:text-white mt-1"
              title="프로필 수정"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">내가 작성한 LP 목록</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          새 LP 생성
        </button>
      </div>

      {isError ? (
        <div>LP 목록을 불러오는데 오류가 발생했습니다.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

      {showCreateModal && (
        <CreateLpModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default MyPage;