import "./Footer.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

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
            <a href="https://www.instagram.com/priyanshuu.singh___/" target="_blank" rel="noopener noreferrer">
              <img src={assets.insta_icon} alt="Instagram" />
            </a>
            <a href="https://github.com/priyanshuuranjan" target="_blank" rel="noopener noreferrer">
              <img src={assets.github_icon} alt="GitHub" />
            </a>
            <a href="https://www.linkedin.com/in/priyanshuranjan45/" target="_blank" rel="noopener noreferrer">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
          </div>
        </div>
        <div className="footer-content-center">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/myorders">Delivery</Link></li>
            <li><Link to="/">Privacy Policy</Link></li>
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
        &copy; {new Date().getFullYear()} <b>Kumar Fertilizer</b>. All Rights Reserved.
      </p>
    </div>
  );
};

export default Footer;
