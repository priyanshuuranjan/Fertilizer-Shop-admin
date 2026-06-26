import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import { useContext, useEffect, useState } from "react";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Verify from "./pages/Verify/Verify";
import MyOrders from './pages/MyOrders/MyOrders'
import Contact from "./components/Contact/Contact";
import Advisor from "./pages/Advisor/Advisor";
import Loader from "./components/Loader/Loader";
import { StoreContext } from "./context/StoreContext";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { productsLoading } = useContext(StoreContext);

  // Show the branded loader only on the very first load (until products arrive).
  const [booting, setBooting] = useState(true);
  useEffect(() => {
    if (!productsLoading) {
      // brief hold so the animation doesn't flash on fast connections
      const t = setTimeout(() => setBooting(false), 400);
      return () => clearTimeout(t);
    }
  }, [productsLoading]);

  if (booting) return <Loader />;

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path ="/contact" element={<Contact/>} />
          <Route path="/advisor" element={<Advisor />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
