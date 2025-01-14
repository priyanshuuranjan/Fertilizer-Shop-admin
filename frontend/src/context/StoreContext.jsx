import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { product_list } from "../assets/assets";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  // to access backend data like JWT token
  const url = "http://localhost:8000";

  // to pas sth token to frontedn while login
  const [token, setToken] = useState("");

  const [product_list, setProductList] = useState([]);

  // add to cart and remove to cart functionality
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  // amount section
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = product_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  // fetch the products that are upload via admin
  const fetchProductList = async () => {
    const response = await axios.get(url + "/api/product/list");
    setProductList(response.data.data);
  };

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData);
  };

  // ye logout hone se bachayega agr refresh kiye tb
  useEffect(() => {
    async function loadData() {
      await fetchProductList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  // pass context value to use in another components
  const contextValue = {
    product_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
