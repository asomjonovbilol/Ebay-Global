"use client";

import Link from "next/link";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "@/context/cart";
import useIsLoading from "@/hooks/useIsLoading";
import { useUser } from "@/context/user";
import MainLayout from "@/components/layouts/MainLayout";
import ClientOnly from "@/components/ClientOnly";
import CheckoutItem from "@/components/CheckoutItem";
import useUserAddress from "@/hooks/useUserAddress";

export default function Checkout() {
  const user = useUser();
  const cart = useCart();
  const router = useRouter();

  let stripe = useRef(null);
  let elements = useRef(null);
  let card = useRef(null);
  let clientSecret = useRef(null);

  const [addressDetails, setAddressDetails] = useState({});
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  useEffect(() => {
    if (cart?.cartTotal() <= 0) {
      toast.error("Your cart is empty!", { autoClose: 3000 });
      return router.push("/");
    }

    useIsLoading(true);

    const getAddress = async () => {
      if (user?.id == null || user?.id == undefined) {
        useIsLoading(false);
        return;
      }

      setIsLoadingAddress(true);
      const response = await useUserAddress();
      if (response) setAddressDetails(response);
      setIsLoadingAddress(false);
    };

    getAddress();
    setTimeout(() => stripeInit(), 300);
  }, [user]);

  const stripeInit = async () => {
    stripe.current = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PK_KEY || ""
    );

    const response = await fetch("/api/stripe", {
      method: "POST",
      body: JSON.stringify({ amount: cart.cartTotal() }),
    });
    const result = await response.json();

    clientSecret.current = result.client_secret;
    elements.current = stripe.current.elements();
    var style = {
      base: { fontSize: "18px" },
      invalid: {
        fontFamily: "Arial, sans-serif",
        color: "#EE4B2B",
        iconColor: "#EE4B2B",
      },
    };
    card.current = elements.current.create("card", {
      hidePostalCode: true,
      style: style,
    });

    card.current.mount("#card-element");
    card.current.on("change", function (event) {
      document.querySelector("button").disabled = event.empty;
      document.querySelector("#card-error").textContent = event.error
        ? event.error.message
        : "";
    });

    useIsLoading(false);
  };

  const pay = async (event) => {
    event.preventDefault();

    if (Object.entries(addressDetails).length == 0) {
      showError("Please add shipping address!");
      return;
    }

    let result = await stripe.current.confirmCardPayment(clientSecret.current, {
      payment_method: { card: card.current },
    });

    if (result.error) {
      showError(result.error.message);
    } else {
      useIsLoading(true);

      try {
        let response = await fetch("/api/orders/create", {
          method: "POST",
          body: JSON.stringify({
            stripe_id: result.paymentIntent.id,
            name: addressDetails.name,
            address: addressDetails.address,
            zipcode: addressDetails.zipcode,
            city: addressDetails.city,
            country: addressDetails.country,
            products: cart.getCart(),
            total: cart.cartTotal(),
          }),
        });

        if (response.ok) {
          toast.success("Order Complete!", { autoClose: 3000 });
          cart.clearCart();
          return router.push("/success");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong?", { autoClose: 3000 });
      }

      useIsLoading(false);
    }
  };

  const showError = (errorMsgText) => {
    let errorMsg = document.querySelector("#card-error");
    toast.error(errorMsgText, { autoClose: 3000 });
    errorMsg.textContent = errorMsgText;
    setTimeout(() => {
      errorMsg.textContent = "";
    }, 3000);
  };

  return (
    <>
      <MainLayout>
        <div id="CheckoutPage" className="mt-4 max-w-[1100px] mx-auto">
          <div className="mt-4 mb-4 text-2xl font-bold">Checkout</div>

          <div className="relative flex items-baseline justify-between w-full gap-4 mx-auto">
            <div className="w-[65%]">
              <div className="p-4 bg-white border rounded-lg">
                <div className="mb-2 text-xl font-semibold">
                  Shipping Address
                </div>

                <div>
                  {!isLoadingAddress ? (
                    <Link
                      href="/address"
                      className="text-sm text-blue-500 underline"
                    >
                      {addressDetails.name ? "Update Address" : "Add Address"}
                    </Link>
                  ) : null}

                  {!isLoadingAddress && addressDetails.name ? (
                    <ul className="mt-2 text-sm">
                      <li>Name: {addressDetails.name}</li>
                      <li>Address: {addressDetails.address}</li>
                      <li>Zip: {addressDetails.zipcode}</li>
                      <li>City: {addressDetails.city}</li>
                      <li>Country: {addressDetails.country}</li>
                    </ul>
                  ) : null}

                  {isLoadingAddress ? (
                    <div className="flex items-center gap-2 mt-1">
                      <AiOutlineLoading3Quarters className="animate-spin" />
                      Getting Address...
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>

              <ClientOnly>
                <div id="Items" className="mt-4 bg-white rounded-lg">
                  {cart.getCart().map((product) => (
                    <CheckoutItem key={product.id} product={product} />
                  ))}
                </div>
              </ClientOnly>
            </div>

            <div
              id="PlaceOrder"
              className="relative -top-[6px] w-[35%] border rounded-lg"
            >
              <ClientOnly>
                <div className="p-4">
                  <div className="flex items-baseline justify-between mb-1 text-sm">
                    <div>Items ({cart.getCart().length})</div>
                    <div>£{(cart.cartTotal() / 100).toFixed(2)}</div>
                  </div>
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div>Shipping:</div>
                    <div>Free</div>
                  </div>

                  <div className="border-t" />

                  <div className="flex items-center justify-between my-4">
                    <div className="font-semibold">Order total</div>
                    <div className="text-2xl font-semibold">
                      £{(cart.cartTotal() / 100).toFixed(2)}
                    </div>
                  </div>

                  <form onSubmit={pay}>
                    <div
                      className="p-2 border border-gray-500 rounded-sm"
                      id="card-element"
                    />

                    <p
                      id="card-error"
                      role="alert"
                      className="relative font-semibold text-center text-red-700 top-2"
                    />

                    <button
                      type="submit"
                      className="w-full p-3 mt-4 text-lg font-semibold text-white bg-blue-600 rounded-full"
                    >
                      <div>Confirm and pay</div>
                    </button>
                  </form>
                </div>
              </ClientOnly>

              <div className="flex items-center justify-center gap-2 p-4 border-t">
                <img width={50} src="/images/logo.svg" />
                <div className="mt-2 mb-2 font-light ">
                  MONEY BACK GUARANTEE
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}
