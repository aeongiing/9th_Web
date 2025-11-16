import { useState } from "react";
import useCreateLp from "../../hooks/mutation/useCreateLp";
import { type CreateLpDto } from "../../types/lp";

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

  const { mutate: createLp } = useCreateLp();

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

  const handleTagAdd = () => {
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
        alert("LP가 성공적으로 생성되었습니다.");
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-neutral-800 text-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">새 LP 생성</h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="제목"
          className="w-full bg-neutral-700 text-white border border-neutral-600 p-3 mb-4 rounded"
        />
        <input
          name="thumbnail"
          value={form.thumbnail}
          onChange={handleChange}
          placeholder="썸네일 URL"
          className="w-full bg-neutral-700 text-white border border-neutral-600 p-3 mb-4 rounded"
        />
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="내용"
          rows={5}
          className="w-full bg-neutral-700 text-white border border-neutral-600 p-3 mb-4 rounded"
        />

        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <input
              value={tagInput}
              onChange={handleTagInput}
              placeholder="태그 입력 후 추가"
              className="flex-1 bg-neutral-700 text-white border border-neutral-600 p-3 rounded"
            />
            <button
              type="button"
              onClick={handleTagAdd}
              className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            >
              추가
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                #{tag}
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="ml-1 text-red-200 hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <label className="block mb-4 text-sm">
          <input
            type="checkbox"
            name="published"
            checked={form.published}
            onChange={handleChange}
            className="mr-2"
          />
          공개 여부
        </label>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-600 hover:bg-neutral-700 rounded"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateLpModal;