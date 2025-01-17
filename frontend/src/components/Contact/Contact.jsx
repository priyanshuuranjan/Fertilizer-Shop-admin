import { useState, useEffect } from "react";
import "./Contact.css";

const Contact = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [formStatus, setFormStatus] = useState(""); // To handle form status feedback

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setIsFormLoaded(true);
    }, 2000);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/xyzzjore", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (response.ok) {
        setFormStatus("success");
        form.reset(); 
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      setFormStatus("error");
    }
  };

  return (
    <section className="contact-section">
      <h2 className="contact-heading">Contact Us</h2>

      <div className="contact-map">
        {!isMapLoaded && (
          <div className="loading-overlay">
            <span>Loading Map...</span>
          </div>
        )}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4285.610793189974!2d84.85212109196056!3d26.650872782914995!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39933733881dcadf%3A0x205f0af7725a632d!2sVirendra%20Singh%20fertilizer%20shop!5e1!3m2!1sen!2sin!4v1696680336721!5m2!1sen!2sin"
          width="100%"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          className="map-frame"
          onLoad={handleMapLoad}
        ></iframe>
      </div>

      <div className="contact-form-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className={`input-field ${isFormLoaded ? "" : "loading"}`}>
            {isFormLoaded ? (
              <input
                type="text"
                placeholder="Your Name"
                name="username"
                required
                autoComplete="off"
              />
            ) : (
              <div className="placeholder"></div>
            )}
          </div>

          <div className={`input-field ${isFormLoaded ? "" : "loading"}`}>
            {isFormLoaded ? (
              <input
                type="email"
                name="Email"
                placeholder="Your Email"
                autoComplete="off"
                required
              />
            ) : (
              <div className="placeholder"></div>
            )}
          </div>

          <div className={`input-field ${isFormLoaded ? "" : "loading"}`}>
            {isFormLoaded ? (
              <textarea
                name="Message"
                cols="30"
                rows="6"
                required
                autoComplete="off"
                placeholder="Your Message"
              ></textarea>
            ) : (
              <div className="placeholder"></div>
            )}
          </div>

          <div className={`submit-btn ${isFormLoaded ? "" : "loading"}`}>
            {isFormLoaded ? (
              <input type="submit" value="Send Message" />
            ) : (
              <div className="placeholder"></div>
            )}
          </div>
        </form>

        {formStatus === "success" && (
          <p className="form-feedback success">
            Thank you for your message! We'll get back to you soon.
          </p>
        )}
        {formStatus === "error" && (
          <p className="form-feedback error">
            Oops! Something went wrong. Please try again later.
          </p>
        )}
      </div>
    </section>
  );
};

export default Contact;
