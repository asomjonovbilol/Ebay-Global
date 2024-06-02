"use client";

import MainLayout from "@/components/layouts/MainLayout";
import { useUser } from "@/context/user";
import useIsLoading from "@/hooks/useIsLoading";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { toast } from "react-toastify";

export default function Orders() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      if (!user && !user?.id) return;
      const response = await fetch("/api/orders");
      const result = await response.json();
      setOrders(result);
      useIsLoading(false);
    } catch (error) {
      toast.error("Something went wrong?", { autoClose: 3000 });
      useIsLoading(false);
    }
  };

  useEffect(() => {
    useIsLoading(true);
    getOrders();
  }, [user]);

  return (
    <MainLayout>
      <section
        id="OrdersPage"
        className="mt-4 max-w-[1200px] mx-auto px-2 min-h-[50vh]"
      >
        <div className="bg-white w-full p-6 min-h-[150px]">
          <div className="flex items-center text-xl">
            <CiDeliveryTruck className="text-green-500" size={35} />
            <span className="pl-4">Orders</span>
          </div>

          {orders.length < 1 ? (
            <div className="flex items-center justify-center">
              You have no order history
            </div>
          ) : null}

          {orders.map((order) => (
            <div className="text-sm pl-[50px]" key={order?.id}>
              <div className="py-1 border-b">
                <p className="pt-2">
                  <span className="mr-2 font-bold">Stripe ID:</span>{" "}
                  {order?.stripe_id}
                </p>
                <p className="pt-2">
                  <span className="mr-2 font-bold">Delivery Address:</span>{" "}
                  {order?.name}, {order?.address}, {order?.zipcode},{" "}
                  {order?.city}, {order?.country}
                </p>
                <p className="pt-2">
                  <span className="mr-2 font-bold">Total:</span> £
                  {order?.total / 100}
                </p>
                <p className="pt-2">
                  <span className="mr-2 font-bold">Order Created:</span> £
                  {moment(order?.created_at).calendar()}
                </p>
                <p className="pt-2">
                  <span className="mr-2 font-bold">Delivery Time:</span> £
                  {moment(order?.created_at).add(3, "days").calendar()}
                </p>

                <div className="flex items-center gap-4">
                  {order?.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <Link
                        href={`/product/${item.product_id}`}
                        className="py-1 font-bold text-blue-500 hover:underline"
                      >
                        <img
                          src={item.product.url + "/120"}
                          className="rounded"
                          width="120"
                          alt=""
                        />
                        {item.product.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
