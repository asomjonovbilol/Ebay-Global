import { useCart } from "@/context/cart";
import { toast } from "react-toastify";

const CartItem = ({ product }) => {
  const cart = useCart();

  const removeItemFromCart = () => {
    let res = confirm(
      `Are you sure you want to remove this? "${product.title}"`
    );

    if (res) {
      cart.removeFromCart(product);
      toast.info("Removed from cart", { autoClose: 3000 });
    }
  };

  return (
    <>
      <div className="relative flex justify-start w-full p-6 my-2 border">
        <img
          src={product?.url + "/150"}
          className="rounded-md w-[150px] h-[150px]"
        />

        <div className="w-full pl-2 overflow-hidden">
          <div className="flex items-center justify-between w-full">
            <p className="font-semibold w-[400px] text-[16px] underline">
              {product?.title}
            </p>
            <p className="text-lg font-bold">
              £{(product?.price / 100).toFixed(2)}
            </p>
          </div>

          <h2 className="mt-2 font-semibold">NEW</h2>

          <p className="mt-2 text-sm w-[86%]">
            {product?.description.substring(0, 150)}...
          </p>

          <div className="absolute bottom-0 right-0 p-4 text-sm">
            <button
              onClick={() => removeItemFromCart()}
              className="text-blue-500 underline transition hover:text-blue-700 hover:scale-105"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
