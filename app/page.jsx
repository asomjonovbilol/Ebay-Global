"use client";

import CarouselComp from "@/components/CarouselComp";
import Product from "@/components/Product";
import MainLayout from "@/components/layouts/MainLayout";
import useIsLoading from "@/hooks/useIsLoading";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    useIsLoading(true);

    const response = await fetch("/api/products");
    const prods = await response.json();

    setProducts([]);
    setProducts(prods);
    useIsLoading(false);
  };

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <MainLayout>
      <CarouselComp />

      <div className="max-w-[1200px] mx-auto">
        <h1 className="px-4 mt-4 mb-6 text-2xl font-bold">Products</h1>

        <div className="grid grid-cols-5 gap-4">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
