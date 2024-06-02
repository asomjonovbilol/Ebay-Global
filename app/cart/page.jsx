"use client";

import CartItem from "@/components/CartItem";
import ClientOnly from "@/components/ClientOnly";
import SimilarProducts from "@/components/SimilarProducts";
import MainLayout from "@/components/layouts/MainLayout";
import { useCart } from "@/context/cart";
import useIsLoading from "@/hooks/useIsLoading";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Cart() {
  const cart = useCart();
  const router = useRouter();

  useEffect(() => {
    useIsLoading(true);
    cart.getCart();
    cart.cartTotal();
    useIsLoading(false);
  }, [cart]);

  const goToCheckout = () => {
    if (!cart.cartTotal()) {
      alert("You don't have any items in the cart.");
      return;
    }
    router.push("/checkout");
  };

  return (
    <MainLayout>
      <section className="max-w-[1200px] mx-auto mb-8 min-h-[300px]">
        <h2 className="my-4 text-2xl font-bold">Shopping Cart</h2>

        <div className="relative flex items-baseline justify-between gap-2">
          <ClientOnly>
            <div className="w-[65%]">
              {cart.getCart().map((product) => (
                <CartItem key={product.id} product={product} />
              ))}
            </div>
          </ClientOnly>

          <div
            id="GoToCheckout"
            className="md:w-[33%] absolute top-0 right-0 m-2"
          >
            <ClientOnly>
              <div className="p-4 bg-white border">
                <button
                  onClick={() => goToCheckout()}
                  className="flex items-center justify-center w-full p-3 mt-4 font-semibold text-white bg-blue-600 rounded-full"
                >
                  Go to checkout
                </button>

                <div className="flex items-center justify-between mt-4 mb-1 text-sm">
                  <span>Items ({cart.getCart().length})</span>
                  <span>£{(cart.cartTotal() / 100).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mb-4 text-sm">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>

                <div className="border-b border-gray-300" />

                <div className="flex items-center justify-between mt-4 mb-1 text-lg font-semibold">
                  <span>Subtotal</span>
                  <span>£{(cart.cartTotal() / 100).toFixed(2)}</span>
                </div>
              </div>
            </ClientOnly>
          </div>
        </div>
      </section>
      <SimilarProducts />
    </MainLayout>
  );
}
