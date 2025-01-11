import { createContext } from "react";
import { product_list } from "../assets/assets";
export  const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
  const contextValue = {
    product_list,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
