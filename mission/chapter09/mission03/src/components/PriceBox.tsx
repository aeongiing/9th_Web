import { useSelector, useDispatch } from '../hooks/useCustomRedux';
import { openModal } from '../slices/modalSlice';

const PriceBox = () => {
  const {total} = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const handleOpenModal = () => {
    // 모달 열기 액션 디스패치
    dispatch(openModal());
  }

  return (
    <div className = 'p-12 flex justify-between'>
      <button onClick={handleOpenModal} className = 'border p-4 rounded-md cursor-pointer hover:bg-gray-100 transition'>  {/* ⭐ 변경 */}
        장바구니 초기화
      </button>
      <div className="text-xl font-semibold">총 가격: {total.toLocaleString()}원</div>
    </div>
  )
}

export default PriceBox