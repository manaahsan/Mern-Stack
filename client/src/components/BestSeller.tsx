import React from "react";
import ProductCard from "./ProductCard";
// import { assets, categories } from "../assets/assets";
import { dummyProducts } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const BestSeller = () => {
  const { products } = useAppContext();
  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Best Seller</p>
      <div className="grid grid-cols-2 gap-3 mt-6 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
      {products
        .filter((product:any) => product.inStock)
        .slice(0, 5)
        .map((product:any, index:Number) => (
          <ProductCard key={index} product={product} />
        ))}
        </div>
    </div>
  );
};

export default BestSeller;
