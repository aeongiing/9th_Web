import { type LP } from '../types/cart';
import { useDispatch } from '../hooks/useCustomRedux';
import { increase, decrease } from '../slices/cartSlice';

interface CartItemProps {
  lp: LP;
}

const CartItem = ({ lp }: CartItemProps) => {
  const dispatch = useDispatch();
    
  const handleIncreaseCount = () => {
    // 수량 증가 액션 디스패치
    dispatch(increase({id: lp.id}));
  }
  const handleDecreaseCount = () => {
    // 수량 감소 액션 디스패치
    dispatch(decrease({id: lp.id}));

    if (lp.amount === 1){
        dispatch(decrease({id: lp.id}) );
        return;
    }
  }


  return (
    <div className="flex items-center p-4 border-b border-gray-200">
      <img
        src={lp.img}
        alt={lp.title}
        className="w-20 h-20 object-cover rounded mr-4"
      />

      <div className="flex-1">
        <h3 className="text-xl font-semibold">{lp.title}</h3>
        <p className="text-sm text-gray-600">{lp.singer}</p>
        <p className="text-sm font-bold text-gray-600">{lp.price}원</p>
      </div>

      <div className="flex items-center">
        <button onClick = {handleDecreaseCount} className="px-3 py-1 bg-gray-300 text-gray-800 rounded-l hover:bg-gray-400 cursor-pointer">
          -
        </button>

        <span className="px-3 py-1 border-y border-gray-300">
          {lp.amount}
        </span>

        <button onClick = {handleIncreaseCount} className="px-3 py-1 bg-gray-300 text-gray-800 rounded-r hover:bg-gray-400 cursor-pointer">
          +
        </button>
      </div>
    </div>
  );
};

export default CartItem;
