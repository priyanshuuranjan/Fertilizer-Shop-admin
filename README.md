# 🌱 Fertilizer Shop

**Fertilizer Shop** is a full-stack **MERN** e-commerce platform that lets farmers and
gardening enthusiasts easily purchase fertilizers, seeds, and farming tools. It offers a
clean storefront, secure JWT authentication, Stripe payments, and a dedicated admin panel
to manage products and orders. 🌾🌻

The project is organised as three independent apps — a REST **API backend**, a customer
**frontend**, and an **admin** panel.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Environment Variables](#-environment-variables)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [API Reference](#-api-reference)
- [Data Models](#-data-models)
- [Deployment Notes](#-deployment-notes)
- [License](#-license)
- [Contributions](#-contributions)
- [Contact](#-contact)

---

## 🚀 Features

### Storefront (`frontend`)
- **Product browsing** with category filtering (Fertilizer, Fungicides, Seeds, Herbicide, Nutrients, Farm Machinery…)
- **Secure authentication** — register/login with JWT
- **Cart** — add/remove items, live quantity & total
- **Stripe checkout** and order placement
- **My Orders** — track personal order status
- **Skeleton loaders** (Facebook/YouTube style shimmer) on every async screen, so slow networks never show a blank page

### Admin Panel (`admin`)
- **Add products** with image upload
- **View & delete** products
- **Manage orders** — view all orders and update their status
- Skeleton loaders for the product list and orders

---

## 🛠️ Tech Stack

| Layer        | Technologies                                                       |
| ------------ | ------------------------------------------------------------------ |
| **Frontend** | React 18, Vite 6, React Router, Axios, Context API, CSS            |
| **Admin**    | React 18, Vite 6, React Router, Axios, React-Toastify              |
| **Backend**  | Node.js, Express 4                                                 |
| **Database** | MongoDB + Mongoose 8 (MongoDB Atlas)                               |
| **Auth**     | JWT (jsonwebtoken), bcrypt                                         |
| **Payments** | Stripe API                                                        |
| **Uploads**  | Multer (images served as static files at `/images`)               |
| **Deploy**   | Render (backend web service + static frontends)                   |

> ℹ️ Global client state uses React's **Context API** (`StoreContext`), not Redux.

---

## 📂 Project Structure

```plaintext
Fertilizer-Shop-admin/
├── README.md
├── LICENSE
├── admin/                          # Admin panel (Vite + React)
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── assets/
│       ├── components/
│       │   ├── Navbar/
│       │   ├── Sidebar/
│       │   └── Skeleton/           # Reusable shimmer loaders (ListRow, OrderCard)
│       └── pages/
│           ├── Add/                # Add product (with image upload)
│           ├── List/               # Product list + delete
│           └── Orders/             # Orders + status update
│
├── backend/                        # Express REST API
│   ├── server.js                   # App entry point
│   ├── package.json
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js                 # JWT auth guard
│   ├── models/
│   │   ├── orderModel.js
│   │   ├── productModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── cartRoute.js
│   │   ├── orderRoute.js
│   │   ├── productRoute.js
│   │   └── userRoute.js
│   └── uploads/                    # Uploaded product images
│
└── frontend/                       # Customer storefront (Vite + React)
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── assets/
        ├── components/
        │   ├── Contact/
        │   ├── ExploreMenu/
        │   ├── Footer/
        │   ├── Header/
        │   ├── LoginPopup/
        │   ├── Navbar/
        │   ├── ProductDisplay/
        │   ├── ProductItem/
        │   └── Skeleton/           # Reusable shimmer loaders (ProductCard, OrderRow)
        ├── context/
        │   └── StoreContext.jsx    # Global state: products, cart, auth, loading
        └── pages/
            ├── Cart/
            ├── Home/
            ├── MyOrders/
            ├── PlaceOrder/
            └── Verify/
```

---

## ✅ Prerequisites

- **Node.js** ≥ 18 (project pins `node@22`)
- A **MongoDB** database — local or [MongoDB Atlas](https://www.mongodb.com/atlas)
- A **Stripe** account for test API keys

---

## 🔐 Environment Variables

Each app reads its own `.env` file. These files are git-ignored — **never commit real secrets**.

**`backend/.env`**
```env
PORT=8000
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>/<db-name>
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:5173
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:8000
```

**`admin/.env`**
```env
VITE_API_URL=http://localhost:8000
```

> In production, set `VITE_API_URL` to your deployed backend URL and
> `FRONTEND_URL` to your deployed storefront URL.

---

## 🚀 Getting Started

Open **three terminals** (one per app). Start the backend first.

### 1. Backend API
```bash
cd backend
npm install
npm run server          # http://localhost:8000
```
Expect: `Server Started on http://localhost:8000` and `DataBase Connected`.

### 2. Frontend (storefront)
```bash
cd frontend
npm install
npm run dev             # http://localhost:5173
```

### 3. Admin panel
```bash
cd admin
npm install
npm run dev             # http://localhost:5174  (Vite auto-picks the next free port)
```

> Both `frontend` and `admin` default to Vite port **5173**; whichever starts
> second automatically moves to **5174**.

---

## 📜 Available Scripts

| App          | Command           | Description                         |
| ------------ | ----------------- | ----------------------------------- |
| **backend**  | `npm run server`  | Start API with nodemon (hot reload) |
| **frontend** | `npm run dev`     | Start Vite dev server               |
| **frontend** | `npm run build`   | Production build                    |
| **frontend** | `npm run preview` | Preview the production build        |
| **frontend** | `npm run lint`    | Run ESLint                          |
| **admin**    | `npm run dev`     | Start Vite dev server               |
| **admin**    | `npm run build`   | Production build                    |
| **admin**    | `npm run preview` | Preview the production build        |
| **admin**    | `npm run lint`    | Run ESLint                          |

---

## 🔌 API Reference

Base URL: `http://localhost:8000`

### Products — `/api/product`
| Method | Endpoint  | Auth | Body                                                                   | Description       |
| ------ | --------- | ---- | ---------------------------------------------------------------------- | ----------------- |
| POST   | `/add`    | —    | `multipart/form-data`: name, description, price, size, category, image | Add a product     |
| GET    | `/list`   | —    | —                                                                      | List all products |
| POST   | `/remove` | —    | `{ id }`                                                               | Delete a product  |

### Users — `/api/user`
| Method | Endpoint    | Body                        | Description        |
| ------ | ----------- | --------------------------- | ------------------ |
| POST   | `/register` | `{ name, email, password }` | Register & get JWT |
| POST   | `/login`    | `{ email, password }`       | Login & get JWT    |

### Cart — `/api/cart`  _(requires `token` header)_
| Method | Endpoint  | Body         | Description          |
| ------ | --------- | ------------ | -------------------- |
| POST   | `/add`    | `{ itemId }` | Add item to cart     |
| POST   | `/remove` | `{ itemId }` | Decrease/remove item |
| POST   | `/get`    | —            | Get user's cart data |

### Orders — `/api/order`
| Method | Endpoint      | Auth | Body                   | Description                    |
| ------ | ------------- | ---- | ---------------------- | ------------------------------ |
| POST   | `/place`      | ✅   | items, amount, address | Create Stripe checkout session |
| POST   | `/verify`     | —    | `{ orderId, success }` | Confirm payment result         |
| POST   | `/userorders` | ✅   | —                      | Get logged-in user's orders    |
| GET    | `/list`       | —    | —                      | List all orders (admin)        |
| POST   | `/status`     | —    | `{ orderId, status }`  | Update order status (admin)    |

### Static
| Method | Endpoint        | Description                     |
| ------ | --------------- | ------------------------------- |
| GET    | `/images/:file` | Serve an uploaded product image |

> 🔑 **Auth:** protected routes expect the JWT in a `token` request header
> (not a `Bearer` Authorization header).

---

## 🗄 Data Models

**Product**
```js
{ name, description, price: Number, size, image, category }
```

**User**
```js
{ name, email (unique), password (hashed), cartData: { [productId]: qty } }
```

**Order**
```js
{ userId, items: [], amount: Number, address: {},
  status: "Order Processing", date, payment: Boolean }
```

---

## 🌐 Deployment Notes

- The three apps deploy independently — backend as a web service, `frontend`/`admin`
  as static sites (Render / Vercel / Netlify).
- Set each app's `VITE_API_URL` to the **deployed backend URL**, and the backend's
  `FRONTEND_URL` to the **deployed storefront URL**.
- **Render free tier:** free web services sleep after ~15 min idle and take ~30–50s to
  wake on the next request (cold start). The skeleton loaders keep the UI graceful during
  this wait. To avoid it, use an uptime pinger (cron-job.org / UptimeRobot) or upgrade the tier.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributions

Contributions, issues, and feature requests are welcome! 🤗💡🛠️
Feel free to check out the **issues page**.

---

## 📞 Contact

For any inquiries, please reach out via:

- **Email**: priyanshumth0808@gmail.com

---

> Built with 🌾 by **Priyanshu Ranjan**
