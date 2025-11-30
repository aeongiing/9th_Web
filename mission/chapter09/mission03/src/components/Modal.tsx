import { useSelector, useDispatch } from '../hooks/useCustomRedux';
import { closeModal } from '../slices/modalSlice';
import { clearCart } from '../slices/cartSlice';

const Modal = () => {
  const { isOpen } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  // 모달 닫기
  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  // 장바구니 초기화 및 모달 닫기
  const handleConfirm = () => {
    dispatch(clearCart());
    dispatch(closeModal());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* 오버레이 배경 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={handleCloseModal}
      />
      
      {/* 모달 콘텐츠 */}
      <div className="bg-white rounded-lg p-6 z-10 shadow-xl max-w-sm w-full mx-4">
        <h2 className="text-lg font-semibold mb-6 text-center">
          정말 삭제하시겠습니까?
        </h2>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleCloseModal}
            className="px-8 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition font-medium"
          >
            아니요
          </button>
          <button
            onClick={handleConfirm}
            className="px-8 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition font-medium"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;