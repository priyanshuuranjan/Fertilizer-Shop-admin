<div align="center">

# 🌱 Kumar Fertilizer Shop

**A full-stack MERN e-commerce platform for farmers and gardening enthusiasts**

[![CI](https://github.com/priyanshuuranjan/Fertilizer-Shop-admin/actions/workflows/ci.yml/badge.svg)](https://github.com/priyanshuuranjan/Fertilizer-Shop-admin/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-6772E5?logo=stripe&logoColor=white)](https://stripe.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Live Demo — Customer Site](https://kumarfertilizer.onrender.com) · [Live Demo — Admin Panel](https://fertilizer-shop-admin-backend.onrender.com) · [Report Bug](https://github.com/priyanshuuranjan/Fertilizer-Shop-admin/issues)

</div>

---

## 📖 Project Overview

Teen alag apps ek saath milke kaam karte hain:

| App | Folder | Kya karta hai |
|-----|--------|---------------|
| 🛒 **Customer Frontend** | `frontend/` | Products browse karo, cart, Stripe payment |
| ⚙️ **Admin Panel** | `admin/` | Products manage karo, orders track karo, dashboard dekho |
| 🖥️ **Backend API** | `backend/` | REST API — database, auth, payments sab handle karta hai |

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [How It All Works — Architecture Flow](#-how-it-all-works--architecture-flow)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Load Balancing with PM2](#-load-balancing-with-pm2)
- [Deployment](#-deployment)
- [Contact](#-contact)

---

## 🚀 Features

### 🛒 Customer Frontend
- Product browsing with category filters (Fertilizer, Seeds, Fungicides, Herbicide, Nutrients, Farm Machinery)
- JWT-based registration & login
- Cart — add/remove, live quantity & total
- Promo code / discount support at checkout
- Stripe payment gateway (test mode)
- Order history with real-time status
- Skeleton shimmer loaders on every async screen
- Fully responsive (mobile-first)

### ⚙️ Admin Panel _(Login protected)_
- **📊 Dashboard** — Revenue cards, 7-day bar chart (Recharts), recent orders table
- **➕ Add Product** — Image upload, name, price, size, category, stock quantity
- **📋 Product List** — Checkbox bulk-select, bulk delete, individual delete
- **📦 Orders** — All orders, status update (Processing → Shipped → Delivered), **CSV Export**
- **👥 Customers** — All users with order count & total spent, search & sort
- **🎟️ Promo Codes** — Create & manage discount codes
- **🔔 Real-time Notifications** — Bell badge via Socket.io (new orders ping instantly)
- **🌙 Dark / Light Mode** toggle
- Responsive sidebar → horizontal navbar on mobile

### 🖥️ Backend API
- RESTful API with Express + MongoDB/Mongoose
- JWT authentication (stateless — no server sessions)
- Rate limiting (200 req / 15 min per IP)
- Request logging — Morgan + Winston (saved to `logs/`)
- Centralized error handling middleware
- Socket.io server (real-time order events)
- Multer image uploads
- Stripe checkout session + webhook verify

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Why |
|-----------|---------|-----|
| Node.js | v20+ | Fast, JavaScript runtime, single language across stack |
| Express.js | v4.21 | Simple routing + middleware chaining |
| MongoDB + Mongoose | v8.9 | Flexible NoSQL schema for products/orders |
| JWT | v9 | Stateless auth — works great with load balancing |
| Bcrypt | v5.1 | One-way password hashing — safe even if DB leaks |
| Stripe | v17.5 | PCI-compliant payment processing |
| Socket.io | v4 | WebSocket real-time bi-directional communication |
| Multer | v1.4 | Multipart form file uploads |
| express-rate-limit | latest | DDoS / brute-force protection |
| Morgan + Winston | latest | HTTP request logging + structured log files |

### Frontend / Admin
| Technology | Version | Why |
|-----------|---------|-----|
| React | v18.3 | Component-based UI, Virtual DOM, industry standard |
| Vite | v6.0 | 10× faster than CRA, instant HMR |
| React Router DOM | v6.28 | Client-side routing (SPA) |
| Axios | v1.7 | HTTP client with interceptors, better than fetch |
| Recharts | latest | Composable charts for dashboard |
| Socket.io-client | latest | Real-time events from server |
| React Toastify | v11 | Toast notifications |

### DevOps / Infrastructure
| Tool | Purpose |
|------|---------|
| GitHub Actions | CI — auto build-check on every push |
| Render.com | CD — auto-deploy on master merge |
| PM2 | Load balancer — cluster mode on all CPU cores |
| MongoDB Atlas | Managed cloud database |

---

## 📂 Project Structure

```
Fertilizer-Shop-admin/
│
├── 📁 backend/                        ← Express REST API
│   ├── server.js                      ← Entry point (HTTP + Socket.io server)
│   ├── config/
│   │   └── db.js                      ← MongoDB Atlas connection
│   ├── controllers/                   ← Business logic
│   │   ├── productController.js       ← Add / list / remove / bulk-remove
│   │   ├── orderController.js         ← Place / verify / list / export CSV
│   │   ├── userController.js          ← Register / login
│   │   ├── cartController.js
│   │   ├── promoController.js         ← Promo code validate & burn
│   │   ├── dashboardController.js     ← Stats + 7-day chart data
│   │   ├── customerController.js      ← Users with order stats
│   │   └── adminController.js         ← Admin login
│   ├── middleware/
│   │   ├── auth.js                    ← JWT verify middleware
│   │   ├── rateLimiter.js             ← 200 req / 15 min per IP
│   │   ├── logger.js                  ← Morgan + Winston
│   │   └── errorHandler.js            ← Centralized error responses
│   ├── models/
│   │   ├── productModel.js            ← Schema: name, price, size, category, stock
│   │   ├── orderModel.js              ← Schema: userId, items[], amount, status
│   │   ├── userModel.js               ← Schema: name, email, password, cartData
│   │   └── promoModel.js
│   ├── routes/
│   │   ├── productRoute.js
│   │   ├── orderRoute.js
│   │   ├── userRoute.js
│   │   ├── cartRoute.js
│   │   ├── promoRoute.js
│   │   ├── adminRoute.js
│   │   ├── dashboardRoute.js          ← GET /api/dashboard/stats
│   │   └── customerRoute.js           ← GET /api/customers/list
│   └── uploads/                       ← Product images (served as static)
│
├── 📁 admin/                          ← Admin Panel (React + Vite)
│   └── src/
│       ├── App.jsx                    ← Routes + token state + Socket context
│       ├── components/
│       │   ├── Navbar/                ← Dark/light toggle + bell notification
│       │   ├── Sidebar/               ← Nav links (Dashboard, List, Orders...)
│       │   ├── Login/                 ← Admin login form
│       │   └── Skeleton/              ← Shimmer loader components
│       └── pages/
│           ├── Dashboard/             ← Stat cards + Recharts bar chart
│           ├── Add/                   ← Product form with image upload
│           ├── List/                  ← Products + bulk-delete checkboxes
│           ├── Orders/                ← Orders + status + CSV export
│           ├── Customers/             ← User table with search & sort
│           └── PromoCode/             ← Discount code management
│
├── 📁 frontend/                       ← Customer Storefront (React + Vite)
│   └── src/
│       ├── context/StoreContext.jsx   ← Global state (cart, auth, products)
│       ├── components/                ← Navbar, ProductItem, ExploreMenu...
│       └── pages/                     ← Home, Cart, PlaceOrder, MyOrders, Verify
│
├── 📁 .github/workflows/
│   └── ci.yml                         ← GitHub Actions CI pipeline
│
├── ecosystem.config.cjs               ← PM2 cluster mode config
└── README.md
```

---

## 🏗️ How It All Works — Architecture Flow

### Request Lifecycle (Backend)

```
React (Frontend / Admin)
        │
        │  HTTP Request (e.g. GET /api/product/list)
        ▼
┌─────────────────────────────────────┐
│           Express Server            │
│                                     │
│  1. cors()          ← allow origins │
│  2. rateLimiter     ← max 200/15min │
│  3. morgan          ← log request   │
│  4. express.json()  ← parse body    │
│                                     │
│  Router → productRoute.js           │
│       ↓                             │
│  Controller → listProduct()         │
│       ↓                             │
│  Mongoose → productModel.find()     │
│       ↓                             │
│  MongoDB Atlas (Cloud Database)     │
│       ↓                             │
│  Response: { success: true, data }  │
└─────────────────────────────────────┘
        │
        ▼
React → setList(data) → UI renders
```

### JWT Authentication Flow

```
User enters email + password
        │
        ▼
POST /api/user/login
        │
        ▼
bcrypt.compare(password, hashedPassword)   ← compare with DB hash
        │
        ├── ❌ Wrong → 401 Unauthorized
        │
        └── ✅ Match → jwt.sign({ id: user._id }, JWT_SECRET)
                │
                ▼
        Token sent to client
                │
                ▼
        localStorage.setItem('token', token)
                │
                ▼
        Every future request → headers: { token }
                │
                ▼
        auth middleware → jwt.verify(token, JWT_SECRET)
                │
                ├── ❌ Invalid / Expired → 401
                └── ✅ Valid → req.body.userId set → next()
```

### Real-time Order Notification (Socket.io)

```
Customer places order (frontend)
        │
        ▼
POST /api/order/place (backend)
        │
        ├── Save order to MongoDB
        ├── Create Stripe checkout session
        └── io.emit('newOrder', { orderId, amount })
                │
                ▼
        Socket.io broadcasts to ALL connected clients
                │
                ▼
        Admin Panel (Navbar.jsx)
        socket.on('newOrder') → setNotifCount(prev + 1)
                │
                ▼
        🔔 Bell badge updates INSTANTLY — no page refresh
```

---

## 🔄 CI/CD Pipeline

### How It Works

```
Developer pushes code
        │
        ▼
GitHub Repository
        │   (webhook triggers automatically)
        ▼
┌──────────────────────────────────────────────────────┐
│              GitHub Actions CI Runner                 │
│                  (Ubuntu Linux VM)                    │
│                                                       │
│  ┌─────────────────┐  ┌──────────────────────────┐  │
│  │  Backend Check  │  │  Admin Frontend Build    │  │
│  │                 │  │                          │  │
│  │  ✓ checkout     │  │  ✓ checkout              │  │
│  │  ✓ Node.js 20   │  │  ✓ Node.js 20            │  │
│  │  ✓ npm ci       │  │  ✓ npm ci                │  │
│  └─────────────────┘  │  ✓ vite build            │  │
│                       │  ✓ upload dist artifact  │  │
│  ┌─────────────────┐  └──────────────────────────┘  │
│  │ Frontend Build  │                                  │
│  │  ✓ npm ci       │  (All 3 jobs run in parallel)   │
│  │  ✓ vite build   │                                  │
│  └─────────────────┘                                  │
└──────────────────────────────────────────────────────┘
        │
        ├── ❌ Any job fails → RED ✗ on GitHub PR — STOP, fix it
        │
        └── ✅ All pass → Merge to master
                │
                ▼
        Render.com detects master update
                │
        ┌───────┴────────┐
        ▼                ▼
   Backend           Frontend
   auto-deploys      auto-deploys
   (node server.js)  (static site)
        │                │
        ▼                ▼
   🚀 LIVE API      🚀 LIVE Site
```

### Workflow File (`.github/workflows/ci.yml`)

```yaml
name: CI

on:
  push:
    branches: ["**"]        # Every branch push
  pull_request:
    branches: [master]      # PRs to master

jobs:
  build-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm", cache-dependency-path: backend/package-lock.json }
      - run: npm ci
        working-directory: backend

  build-admin:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm", cache-dependency-path: admin/package-lock.json }
      - run: npm ci
        working-directory: admin
      - run: npm run build
        working-directory: admin
        env:
          VITE_API_URL: http://localhost:8000

  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20", cache: "npm", cache-dependency-path: frontend/package-lock.json }
      - run: npm ci
        working-directory: frontend
      - run: npm run build
        working-directory: frontend
        env:
          VITE_API_URL: http://localhost:8000
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Stripe account (test keys)

### 1. Clone the repo
```bash
git clone https://github.com/priyanshuuranjan/Fertilizer-Shop-admin.git
cd Fertilizer-Shop-admin
```

### 2. Setup Environment Variables

Create `.env` files (see [Environment Variables](#-environment-variables) section below)

### 3. Start all three apps

Open **3 terminals**:

```bash
# Terminal 1 — Backend
cd backend && npm install && npm run server

# Terminal 2 — Customer Frontend
cd frontend && npm install && npm run dev

# Terminal 3 — Admin Panel
cd admin && npm install && npm run dev
```

| App | URL |
|-----|-----|
| Backend API | http://localhost:8000 |
| Customer Site | http://localhost:5173 |
| Admin Panel | http://localhost:5174 |

---

## 🔐 Environment Variables

> ⚠️ Never commit `.env` files. They are in `.gitignore`.

**`backend/.env`**
```env
PORT=8000
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster>/<dbname>
JWT_SECRET=your_random_secret_here
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@yourshop.com
ADMIN_PASSWORD=YourSecurePassword
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:8000
```

**`admin/.env`**
```env
VITE_API_URL=http://localhost:8000
```

---

## 🔌 API Reference

Base URL: `http://localhost:8000`

### Products — `/api/product`
| Method | Endpoint | Body / Params | Description |
|--------|----------|---------------|-------------|
| `POST` | `/add` | `multipart/form-data`: name, description, price, size, category, stock, image | Add product |
| `GET` | `/list` | — | All products |
| `POST` | `/remove` | `{ id }` | Delete one product |
| `POST` | `/bulk-remove` | `{ ids: [] }` | Delete multiple products |

### Users — `/api/user`
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | `{ name, email, password }` | Register → JWT |
| `POST` | `/login` | `{ email, password }` | Login → JWT |

### Orders — `/api/order`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/place` | ✅ JWT | Place order + Stripe session |
| `POST` | `/verify` | — | Confirm Stripe payment |
| `POST` | `/userorders` | ✅ JWT | User's own orders |
| `GET` | `/list` | — | All orders (admin) |
| `POST` | `/status` | — | Update order status |
| `GET` | `/export` | — | Download orders as CSV |

### Cart — `/api/cart` _(JWT required)_
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/add` | `{ itemId }` | Add to cart |
| `POST` | `/remove` | `{ itemId }` | Remove from cart |
| `POST` | `/get` | — | Get cart data |

### Dashboard & Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/dashboard/stats` | Revenue, orders, users, products, 7-day chart |
| `GET` | `/api/customers/list` | All users with order count + total spent |

### Admin
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/admin/login` | `{ email, password }` | Admin JWT token |

### Promo Codes — `/api/promo`
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/validate` | Validate promo code at checkout |
| `GET` | `/list` | All promo codes (admin) |
| `POST` | `/add` | Create new promo code |
| `POST` | `/remove` | Delete promo code |

---

## ⚡ Load Balancing with PM2

Node.js is single-threaded — by default only 1 CPU core is used.  
PM2 cluster mode spawns one process per core → full CPU utilization.

```bash
# Install PM2
npm install -g pm2

# Start in cluster mode (uses ecosystem.config.cjs)
pm2 start ecosystem.config.cjs

# Check status
pm2 status

# Live logs
pm2 logs

# Zero-downtime reload (when you deploy new code)
pm2 reload all

# Auto-start on server reboot
pm2 save && pm2 startup
```

```
Without PM2:  [Core 1: Node] [Core 2: idle] [Core 3: idle] [Core 4: idle]
With PM2:     [Core 1: Node] [Core 2: Node] [Core 3: Node] [Core 4: Node]
              ↑              ↑              ↑              ↑
         Process 1      Process 2      Process 3      Process 4
              └──────────── PM2 Round-Robin ──────────────┘
```

---

## 🌐 Deployment

### Render.com Setup

#### Backend (Web Service)
| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Auto-Deploy | ✅ Yes (from `master`) |

Add all `backend/.env` variables in Render's **Environment** tab.

#### Admin Panel (Static Site)
| Setting | Value |
|---------|-------|
| Root Directory | `admin` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Auto-Deploy | ✅ Yes (from `master`) |

Set `VITE_API_URL` = your deployed backend URL.

#### Customer Frontend (Static Site)
Same as Admin Panel but root directory = `frontend`.

> **Note:** Render free tier sleeps after ~15 min idle → ~30s cold start. The skeleton loaders keep the UI graceful during this wait. Use [UptimeRobot](https://uptimerobot.com) (free) to ping your API every 5 min to keep it awake.

---

## 📄 License

Licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 📞 Contact

**Priyanshu Ranjan**
- Email: priyanshumth0808@gmail.com
- GitHub: [@priyanshuuranjan](https://github.com/priyanshuuranjan)

---

<div align="center">
Built with ❤️ by <strong>Priyanshu Ranjan</strong>
</div>
