# 🌱 Fertilizer Shop

**Fertilizer Shop** is an e-commerce platform designed for farmers and individuals to easily purchase fertilizers, seeds, and farming tools. The platform provides a user-friendly interface, secure transactions, and a robust admin panel to manage inventory and orders efficiently. Whether you're a seasoned farmer or a gardening enthusiast, this application is tailored to meet your needs. 🌾🌻

---

## 🚀 Features

- **Product Browsing**: Explore a wide variety of fertilizers, seeds, and farming tools with detailed descriptions and images.
- **Secure Authentication**: User and admin authentication powered by JWT tokens to ensure secure login processes.
- **Online Payments**: Integrated with Stripe for smooth, secure, and reliable payment processing.
- **Admin Panel**: An easy-to-use admin panel to manage products, orders, and inventory.
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices, ensuring a seamless experience across all platforms.

---

## 🛠️ Technologies Used

- **Frontend**: 
  - React.js (for building the user interface)
  - Redux Toolkit (for state management)
  - CSS (for responsive and customizable styling)

- **Backend**: 
  - Node.js (JavaScript runtime)
  - Express.js (web framework for Node.js)

- **Authentication**: 
  - JWT (JSON Web Tokens) for token-based authentication

- **Database**: 
  - MongoDB (NoSQL database hosted on MongoDB Atlas)

- **Payments**: 
  - Stripe API (for handling secure online payments)

- **Deployment**: 
  - Render (for easy and scalable deployment)

---

## 📂 Project Structure

```plaintext
priyanshuuranjan-fertilizer-shop-admin/
├── README.md
├── LICENSE
├── admin/
│   ├── README.md
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js
│   ├── .gitignore
│   ├── public/
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── assets/
│       │   └── assets.js
│       ├── components/
│       │   ├── Navbar/
│       │   │   ├── Navbar.css
│       │   │   └── Navbar.jsx
│       │   └── Sidebar/
│       │       ├── Sidebar.css
│       │       └── Sidebar.jsx
│       └── pages/
│           ├── Add/
│           │   ├── Add.css
│           │   └── Add.jsx
│           ├── List/
│           │   ├── List.css
│           │   └── List.jsx
│           └── Orders/
│               ├── Orders.css
│               └── Orders.jsx
├── backend/
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── orderModel.js
│   │   ├── productModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── cartRoute.js
│   │   ├── orderRoute.js
│   │   ├── productRoute.js
│   │   └── userRoute.js
│   └── uploads/
└── frontend/
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── vite.config.js
    ├── .gitignore
    ├── public/
    └── src/
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── assets/
        │   └── assets.js
        ├── components/
        │   ├── Contact/
        │   │   ├── Contact.css
        │   │   └── Contact.jsx
        │   ├── ExploreMenu/
        │   │   ├── ExploreMenu.css
        │   │   └── ExploreMenu.jsx
        │   ├── Footer/
        │   │   ├── Footer.css
        │   │   └── Footer.jsx
        │   ├── Header/
        │   │   ├── Header.css
        │   │   └── Header.jsx
        │   ├── LoginPopup/
        │   │   ├── LoginPopup.css
        │   │   └── LoginPopup.jsx
        │   ├── Navbar/
        │   │   ├── Navbar.css
        │   │   └── Navbar.jsx
        │   ├── ProductDisplay/
        │   │   ├── ProductDisplay.css
        │   │   └── ProductDisplay.jsx
        │   └── ProductItem/
        │       ├── ProductItem.css
        │       └── ProductItem.jsx
        ├── context/
        │   └── StoreContext.jsx
        └── pages/
            ├── Cart/
            │   ├── Cart.css
            │   └── Cart.jsx
            ├── Home/
            │   ├── Home.css
            │   └── Home.jsx
            ├── MyOrders/
            │   ├── MyOrders.css
            │   └── MyOrders.jsx
            ├── PlaceOrder/
            │   ├── PlaceOrder.css
            │   └── PlaceOrder.jsx
            └── Verify/
                ├── Verify.css
                └── Verify.jsx
```

---
🔧 Environment Variables
Create a .env file in the backend and frontend directories:
# Backend
PORT=5000
DB_URI=your_database_connection_string

# Frontend
VITE_API_KEY=your_MongoDb_key
---

## 📄 License 📜📘📂

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 🤝 Contributions 🧑‍🤝‍🧑💻📋

Contributions, issues, and feature requests are welcome! 🤗💡🛠️  
Feel free to check out the **issues page**.

---

## 📞 Contact 📧📲📞

For any inquiries, please reach out via:

- **Email**: priyanshumth0808@gmail.com

---

