import { useContext } from "react";
import "./ProductDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import ProductItem from "../ProductItem/ProductItem";

const ProductDisplay = ({ category }) => {
  const { product_list } = useContext(StoreContext);

  return (
    <div className="product-display" id="product-display">
      <h2 className="h2we">Top Fertilizers Near You</h2>
      <div className="product-display-list">
        {product_list.map((item, index) => {
          // Display Product on clicking on each menu separately or if menu is not selected then it display all the products
          if (category === "All" || category === item.category) {
            return (
              <ProductItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default ProductDisplay;
