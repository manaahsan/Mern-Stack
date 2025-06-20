import { useAppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { categories } from "../assets/assets";
import ProductCard from "../components/ProductCard";

const ProductCategory = () => {
  const { products } = useAppContext();
  const { category } = useParams();
  const searchCategory = categories?.find(
    (item) => item.path.toLowerCase() === category
  );
  const filteredProducts = products?.filter(
    (product: any) => product.category.toLowerCase() === category
  );
  return (
    <div className="mt-16">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <p className="text-2xl font-medium">
            {searchCategory.text.toUpperCase()}
          </p>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
      )}

      {filteredProducts?.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 mt-6 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
          {filteredProducts?.map((product: any, index: number) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div>No Products Found</div>
      )}
    </div>
  );
};

export default ProductCategory;
