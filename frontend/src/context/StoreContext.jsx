import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [product_list, setProductList] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(() => {
    const saved = localStorage.getItem("appliedPromo");
    return saved ? JSON.parse(saved) : null;
  });

  // uses proxy
  const url = import.meta.env.VITE_API_URL;

  const deliveryFee = 45;

  // Add to cart functionality
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    if (token) {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        { headers: { token } }
      );
    }
  };

  // Remove from cart functionality
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 0) - 1, 0),
    }));

    if (token) {
      await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        { headers: { token } }
      );
    }
  };

  // Cal total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = product_list.find(
          (product) => String(product._id) === String(item)
        );
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        } else {
          console.warn(`Product with ID ${item} not found in product_list.`);
        }
      }
    }
    return totalAmount;
  };

  // Apply a promo code against the current subtotal
  const applyPromoCode = async (code) => {
    const subtotal = getTotalCartAmount();
    try {
      const response = await axios.post(
        `${url}/api/promo/apply`,
        { code, subtotal },
        { headers: { token } }
      );
      if (response.data.success) {
        const promo = { code: response.data.code, discount: response.data.discount };
        setAppliedPromo(promo);
        localStorage.setItem("appliedPromo", JSON.stringify(promo));
      }
      return response.data;
    } catch (error) {
      console.error("Error applying promo code:", error);
      return { success: false, message: "Error applying promo code" };
    }
  };

  // Remove the currently applied promo code
  const removePromoCode = () => {
    setAppliedPromo(null);
    localStorage.removeItem("appliedPromo");
  };

  // Discount currently applied, clamped to the subtotal
  const getDiscount = () => {
    if (!appliedPromo) return 0;
    return Math.min(appliedPromo.discount, getTotalCartAmount());
  };

  // Fetch product list from backend
  const fetchProductList = async () => {
    setProductsLoading(true);
    setProductsError(false);
    try {
      const response = await axios.get(`${url}/api/product/list`);
      setProductList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching product list:", error);
      setProductsError(true);
    } finally {
      setProductsLoading(false);
    }
  };

  // Load cart data for authenticated user
  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        { headers: { token } }
      );
      setCartItems(response.data.cartData || {});
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  // Effect to load initial data
  useEffect(() => {
    const loadData = async () => {
      await fetchProductList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    };
    loadData();
  }, []);

  // Context value
  const contextValue = {
    product_list,
    productsLoading,
    productsError,
    fetchProductList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    deliveryFee,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    getDiscount,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
