import Link from "next/link";

const Product = ({ product }) => {
  return (
    <>
      <Link
        href={`/product/${product.id}`}
        className="max-w-[200px] p-1.5 border border-gray-50 hover:border-gray-200 hover:shadow-xl bg-gray-100 rounded mx-auto"
      >
        {product?.url ? (
          <img
            src={product.url + "/190"}
            className="rounded cursor-pointer"
            alt="image"
          />
        ) : null}

        <div className="px-1 pt-2">
          <span className="font-semibold text-[15px] hover:underline cursor-pointer">
            {product?.title}
          </span>

          <p className="font-extrabold">£{(product?.price / 100).toFixed(2)}</p>

          <div className="relative items-center flex text-[12px] text-gray-500">
            <span className="line-through">
              £{((product?.price * 1.2) / 100).toFixed(2)}
            </span>

            <span className="px-2">-</span>
            <span className="line-through">20%</span>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Product;
