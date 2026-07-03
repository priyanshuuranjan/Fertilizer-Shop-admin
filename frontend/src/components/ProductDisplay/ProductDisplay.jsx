import { useContext } from "react";
import "./ProductDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import ProductItem from "../ProductItem/ProductItem";
import { ProductCardSkeleton } from "../Skeleton/Skeleton";

const ProductDisplay = ({ category }) => {
  const { product_list, productsLoading, productsError, fetchProductList } =
    useContext(StoreContext);

  const visibleProducts = product_list.filter(
    (item) => category === "All" || category === item.category
  );

  return (
    <div className="product-display" id="product-display">
      <h2 className="h2we">Top Fertilizers Near You</h2>

      {productsLoading ? (
        <div className="product-display-list">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : productsError ? (
        <div className="product-display-status">
          <p>Couldn&apos;t load products. Please check your connection.</p>
          <button className="product-display-retry" onClick={fetchProductList}>
            Retry
          </button>
        </div>
      ) : visibleProducts.length === 0 ? (
        <div className="product-display-status">
          <p>No fertilizers found in this category.</p>
        </div>
      ) : (
        <div className="product-display-list">
          {visibleProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
              size={item.size}
              stock={item.stock}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;
