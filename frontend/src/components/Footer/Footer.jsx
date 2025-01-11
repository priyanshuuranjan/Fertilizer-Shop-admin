import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <p>
            <span className="highlight-text">Kumar Fertilizer</span> <br />
            Established in 2002, stands as India's top online agricultural
            supplier. They offer a complete range of farming essentials, such as
            seeds, fertilizers, pesticides, plant growth regulators, irrigation,
            and farming tools, all at the most competitive prices, with
            dedicated customer support.
          </p>

          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+91 9523XXXXXX</li>
            <li>priyanshumth0808@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />

      <p className="footer-copyright">
        {/* auto update year on footer */}
        &copy; {new Date().getFullYear()} <b>Kumar Fertilizer</b>. All Rights
        Reserved.
      </p>
    </div>
  );
};

export default Footer;
