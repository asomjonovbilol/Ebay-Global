import React, { useEffect, useState } from "react";
import Product from "./Product";
import { BiLoader } from "react-icons/bi";

export default function SimilarProducts() {
  const [products, setProducts] = useState([]);

  const getRandomProducts = async () => {
    try {
      const res = await fetch("/api/products/get-random");
      const result = await res.json();

      if (result) {
        setProducts(result);
        return;
      }

      setProducts([]);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  useEffect(() => {
    getRandomProducts();
  }, []);
  return (
    <div>
      <div className="border-b py-1 max-w-[1200px] mx-auto" />

      <div className="max-w-[1200px] mx-auto">
        <h2 className="py-2 mt-4 text-2xl font-bold">
          Similar sponspored items
        </h2>

        {products.length ? (
          <div className="grid grid-cols-5 gap-4">
            {products.map((product) => (
              <Product key={product.id} id={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center gap-4 font-semibold">
              <BiLoader size={30} className="text-blue-400 animate-spin" />
              Loading Products...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
