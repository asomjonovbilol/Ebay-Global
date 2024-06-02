"use client";

import { usePathname } from "next/navigation";

const CheckoutItem = ({ product }) => {
  const pathname = usePathname();
  return (
    <>
      <div className="flex justify-start p-4 mb-2 border rounded-lg">
        <img
          src={product.url + "/150"}
          alt=""
          className="rounded-md w-[150px] h-[150px]"
        />
        <div className="pl-2 overflow-hidden">
          <h2 className="font-semibold">{product.title}</h2>

          <div className="text-lg font-semibold">
            <span className="font-bold">
              £{(product.price / 100).toFixed(2)}
            </span>
          </div>

          <div className="relative flex items-center text-[14px] text-gray-500">
            <span className="line-through">
              £{((product.price * 1.2) / 100).toFixed(2)}
            </span>
            <span className="px-2">-</span>
            <span className="line-through">20%</span>
          </div>

          <p className="mt-2 text-sm">
            {product.description.substring(0, 130)}...
          </p>

          {/* {pathname === "/cart" ? (
            <div className="flex justify-end w-full mt-2 text-sm text-blue-500 underline cursor-pointer">
              Remove
            </div>
          ) : null} */}
        </div>
      </div>
    </>
  );
};

export default CheckoutItem;
