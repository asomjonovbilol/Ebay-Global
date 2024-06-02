"use client";

import SimilarProducts from "@/components/SimilarProducts";
import MainLayout from "@/components/layouts/MainLayout";
import { useCart } from "@/context/cart";
import useIsLoading from "@/hooks/useIsLoading";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ProductPage({ params }) {
  const cart = useCart();

  const [product, setProduct] = useState({});

  const getProduct = async () => {
    useIsLoading(true);
    setProduct({});

    const response = await fetch(`/api/product/${params.id}`);
    const prod = await response.json();
    setProduct(prod);

    cart.isItemAddedToCart(prod);
    useIsLoading(false);
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <>
      <MainLayout>
        <section className="max-w-[1200px] mx-auto">
          <div className="flex px-4 py-10">
            {product?.url ? (
              <img className="w-[40%] rounded-lg" src={product?.url + "/280"} />
            ) : (
              <div className="w-[40%]"></div>
            )}

            <div className="w-full px-4">
              <p className="text-xl font-bold">{product?.title}</p>
              <p className="pt-2 text-sm text-gray-700">
                Brand New - Full Warranty
              </p>

              <div className="py-1 border-b" />

              <div className="pt-3 pb-2">
                <p className="flex items-center">
                  Condition:
                  <span className="font-bold text-[17px] ml-2">New</span>
                </p>
              </div>

              <div className="py-1 border-b" />

              <div className="pt-3">
                <div className="flex items-center justify-between w-full">
                  <p className="flex items-center">
                    Price:
                    {product?.price && (
                      <span className="font-bold text-[20px] ml-2">
                        GBP £{(product?.price / 100).toFixed(2)}
                      </span>
                    )}
                  </p>

                  <button
                    onClick={() => {
                      if (cart.isItemAdded) {
                        cart.removeFromCart(product);
                        toast.info("Removed from cart", { autoClose: 3000 });
                      } else {
                        cart.addToCart(product);
                        toast.success("Added to cart", { autoClose: 3000 });
                      }
                    }}
                    className={`text-white py-2 px-20 rounded-full cursor-pointer bg-[#3498C9]
                  ${
                    cart.isItemAdded
                      ? "bg-[#e9a321] hover:bg-[#bf851a]"
                      : "bg-[#3498C9] hover:bg-[#0054A0]"
                  }
                  `}
                  >
                    {cart.isItemAdded ? "Remove From Cart" : "Add To Cart"}
                  </button>
                </div>
              </div>
              <div className="py-1 border-b" />

              <div className="pt-3">
                <h4 className="pb-1 font-semibold">Description:</h4>
                <p className="text-sm text-justify">{product?.description}</p>
              </div>
            </div>
          </div>
        </section>

        <SimilarProducts />
      </MainLayout>
    </>
  );
}
