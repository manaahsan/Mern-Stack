import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

const AllProducts = () => {
  const { products, searchQuery } = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    if (searchQuery) {
      setFilteredProducts(
        products.filter((product: any) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);
  return (
    <div className="flex flex-col mt-16">
      <div className="flex flex-col items-end w-max">
        <p className="text-2xl font-semibold uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 gap-3 mt-6 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {filteredProducts
          .filter((product: any) => product.inStock)
          .map((product: any, index: number) => (
            <ProductCard key={index} product={product} />
          ))}
      </div>
    </div>
  );
};

export default AllProducts;
