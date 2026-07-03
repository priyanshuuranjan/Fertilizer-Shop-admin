import { useEffect, useState } from "react";
import "./Contact.css";

const Contact = () => {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [formStatus, setFormStatus] = useState(""); // "" | "sending" | "success" | "error"

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleMapLoad = () => setIsMapLoaded(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    setFormStatus("sending");
    try {
      const response = await fetch("https://formspree.io/f/xyzzjore", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (response.ok) {
        setFormStatus("success");
        form.reset();
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-heading-wrap">
        <h2 className="contact-heading">Get In Touch</h2>
        <p className="contact-subheading">
          Questions about an order, a product, or bulk pricing? Send us a
          message — we typically reply within a day.
        </p>
      </div>

      <div className="contact-grid">
        <div className="contact-info-col">
          <div className="contact-info-card fade-in-up" style={{ "--d": "0.05s" }}>
            <span className="contact-info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <div>
              <p className="contact-info-label">Call Us</p>
              <p className="contact-info-value">+91 9523 XXX XXX</p>
            </div>
          </div>

          <a href="mailto:priyanshumth0808@gmail.com" className="contact-info-card fade-in-up" style={{ "--d": "0.12s" }}>
            <span className="contact-info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <div>
              <p className="contact-info-label">Email Us</p>
              <p className="contact-info-value">priyanshumth0808@gmail.com</p>
            </div>
          </a>

          <div className="contact-info-card fade-in-up" style={{ "--d": "0.19s" }}>
            <span className="contact-info-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <div>
              <p className="contact-info-label">Store Hours</p>
              <p className="contact-info-value">Mon – Sat, 9:00 AM – 7:00 PM</p>
            </div>
          </div>

          <div className="contact-map fade-in-up" style={{ "--d": "0.26s" }}>
            {!isMapLoaded && (
              <div className="loading-overlay">
                <span className="map-spinner" />
                <span>Loading map…</span>
              </div>
            )}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4285.610793189974!2d84.85212109196056!3d26.650872782914995!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39933733881dcadf%3A0x205f0af7725a632d!2sVirendra%20Singh%20fertilizer%20shop!5e1!3m2!1sen!2sin!4v1696680336721!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="map-frame"
              onLoad={handleMapLoad}
              title="Store location"
            ></iframe>
          </div>
        </div>

        <div className="contact-form-container fade-in-up" style={{ "--d": "0.1s" }}>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label className="float-field">
              <input type="text" placeholder=" " name="username" required autoComplete="off" />
              <span className="float-label">Your Name</span>
            </label>

            <label className="float-field">
              <input type="email" placeholder=" " name="Email" required autoComplete="off" />
              <span className="float-label">Your Email</span>
            </label>

            <label className="float-field">
              <textarea placeholder=" " name="Message" rows="6" required autoComplete="off"></textarea>
              <span className="float-label">Your Message</span>
            </label>

            <button
              type="submit"
              className={`contact-submit-btn ${formStatus === "sending" ? "is-sending" : ""}`}
              disabled={formStatus === "sending"}
            >
              {formStatus === "sending" ? (
                <span className="contact-submit-spinner" />
              ) : (
                <>
                  Send Message <span className="contact-submit-arrow">→</span>
                </>
              )}
            </button>
          </form>

          {formStatus === "success" && (
            <p className="form-feedback success">
              ✓ Thank you for your message! We'll get back to you soon.
            </p>
          )}
          {formStatus === "error" && (
            <p className="form-feedback error">
              Oops! Something went wrong. Please try again later.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
