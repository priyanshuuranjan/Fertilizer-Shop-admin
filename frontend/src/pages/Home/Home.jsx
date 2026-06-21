import { useState } from "react";
import "./Home.css";
import Header from "../../components/Header/Header";
import ExploreMenu from "../../components/ExploreMenu/ExploreMenu";
import ProductDisplay from "../../components/ProductDisplay/ProductDisplay";
import { Link } from "react-router-dom";

const Home = () => {
  const [category, setCategory] = useState("All");
  return (
    <div>
      <Header />
      <Link to="/advisor" className="advisor-banner">
        <div>
          <h3>🧮 Kitni khaad chahiye? Pata nahi?</h3>
          <p>Apni fasal aur zameen daaliye — turant sahi maatra aur kharcha jaaniye.</p>
        </div>
        <span className="advisor-banner-btn">Try Crop Advisor →</span>
      </Link>
      <ExploreMenu category={category} setCategory={setCategory} />
      <ProductDisplay category={category} />
    </div>
  );
};

export default Home;
