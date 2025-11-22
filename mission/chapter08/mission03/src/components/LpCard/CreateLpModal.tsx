// src/components/LpCard/CreateLpModal.tsx
import { useState } from "react";
import useCreateLp from "../../hooks/mutation/useCreateLp";
import { type CreateLpDto } from "../../types/lp";
import { X, Plus, Image, FileText, Tag as TagIcon } from "lucide-react";

interface Props {
  onClose: () => void;
}

const CreateLpModal = ({ onClose }: Props) => {
  const [form, setForm] = useState<CreateLpDto>({
    title: "",
    content: "",
    thumbnail: "",
    tags: [],
    published: false,
  });

  const [tagInput, setTagInput] = useState("");

  const { mutate: createLp, isPending } = useCreateLp();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? target.checked : value,
    }));
  };

  const handleTagInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagAdd = (e?: React.KeyboardEvent) => {
    if (e && e.key !== "Enter") return;
    
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = () => {
    if (!form.title || !form.content || !form.thumbnail) {
      alert("제목, 내용, 썸네일은 필수입니다.");
      return;
    }

    createLp(form, {
      onSuccess: () => {
        alert("LP가 성공적으로 생성되었습니다!");
        onClose();
      },
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            새로운 LP 만들기
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6 space-y-6">
          {/* 제목 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <FileText size={16} />
              제목 <span className="text-red-400">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="LP의 제목을 입력하세요"
              className="w-full bg-gray-800/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-lg transition-all outline-none placeholder-gray-500"
            />
          </div>

          {/* 썸네일 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <Image size={16} />
              썸네일 URL <span className="text-red-400">*</span>
            </label>
            <input
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-gray-800/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-lg transition-all outline-none placeholder-gray-500"
            />
            {form.thumbnail && (
              <div className="mt-2 rounded-lg overflow-hidden border border-gray-700">
                <img 
                  src={form.thumbnail} 
                  alt="미리보기" 
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <FileText size={16} />
              내용 <span className="text-red-400">*</span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="LP에 대한 설명을 작성해주세요"
              rows={6}
              className="w-full bg-gray-800/50 text-white border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 p-3 rounded-lg transition-all outline-none placeholder-gray-500 resize-none"
            />
          </div>

          {/* 태그 */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-300">
              <TagIcon size={16} />
              태그
            </label>
            
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={handleTagInput}
                onKeyPress={(e) => handleTagAdd(e)}
                placeholder="태그를 입력하고 Enter 또는 추가 버튼을 클릭하세요"
                className="flex-1 bg-gray-800/50 text-white border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 p-3 rounded-lg transition-all outline-none placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => handleTagAdd()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-3 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-purple-500/50"
              >
                <Plus size={18} />
                추가
              </button>
            </div>

            {/* 태그 목록 */}
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                {form.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="group bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:from-purple-600/30 hover:to-blue-600/30 transition-all"
                  >
                    #{tag}
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="text-purple-400 hover:text-red-400 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 공개 여부 */}
          <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={form.published}
              onChange={handleChange}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
            <label 
              htmlFor="published" 
              className="text-sm font-medium text-gray-300 cursor-pointer select-none"
            >
              공개 게시물로 설정
            </label>
          </div>
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                생성 중...
              </>
            ) : (
              <>
                <Plus size={18} />
                LP 생성하기
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLpModal;