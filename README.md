# CyberLoot 🎮 — Full-Stack E-Commerce Store

A full-stack e-commerce web app for gaming gear, built from the ground up with **React + TypeScript**, **Node.js/Express**, and **PostgreSQL**.

## Tech Stack

| Layer     | Technology                                                        |
| --------- | ----------------------------------------------------------------- |
| Frontend  | React 19, TypeScript, Vite, Tailwind CSS, React Router 7          |
| Backend   | Node.js, Express 5, JWT auth, bcrypt, Helmet, Morgan              |
| Database  | PostgreSQL 17 with hand-written SQL migrations + seed scripts     |

## Features

- 🔐 **JWT authentication** — register/login (with username *or* email), protected routes, token validation on startup
- 🛍️ **Product catalog** — categories, full-text search, sorting (price/rating), product detail pages with image gallery & specs
- 🛒 **Persistent cart** — stored in PostgreSQL per user, quantity capped at available stock, live cart badge in the navbar
- 📦 **Orders & checkout** — transactional checkout (stock is decremented atomically), order history, cancel pending orders (stock restored)
- ⭐ **Product reviews** — one review per user per product, aggregate rating recalculated automatically
- 📉 **Inventory tracking** — stock levels shown on cards and detail pages, out-of-stock handling end to end
- 👤 **Profile page** — account info plus live order/cart stats
- 🔔 Toast notifications, loading spinners, 404 page, responsive layout

## Project Structure

```
E-com/
├── backend/               # Express REST API
│   ├── controllers/       # auth, products, cart, orders, reviews
│   ├── routes/            # route definitions
│   ├── middleware/        # JWT auth middleware
│   ├── db/
│   │   ├── migrations/    # numbered SQL migrations
│   │   ├── migrate.js     # migration runner (tracks schema_migrations)
│   │   ├── seed.js        # seeds categories + 12 products
│   │   └── index.js       # pg connection pool
│   └── server.js
└── frontend/              # React + TypeScript SPA (Vite)
    └── src/
        ├── api/           # typed fetch client
        ├── components/    # Navbar, ProductCard, RatingStars, ...
        ├── context/       # Auth, Cart, Toast providers
        ├── pages/         # Home, Products, Cart, Checkout, Orders, ...
        └── types.ts       # shared domain types
```

## Database Schema

`users` · `categories` · `products` · `cart_items` · `orders` · `order_items` · `reviews`
(plus `schema_migrations` for migration bookkeeping — see [backend/db/migrations](backend/db/migrations))

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 17 running locally

### 1. Database

```sql
CREATE DATABASE ecom_db;
```

### 2. Backend

```bash
cd backend
cp .env.example .env        # then edit DATABASE_URL / JWT_SECRET
npm install
npm run setup               # runs migrations + seeds the catalog
npm run dev                 # http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                 # http://localhost:5173
```

## API Overview

| Method | Endpoint                     | Auth | Description                        |
| ------ | ---------------------------- | ---- | ---------------------------------- |
| POST   | `/api/auth/register`         | –    | Create account, returns JWT        |
| POST   | `/api/auth/login`            | –    | Login (username or email)          |
| GET    | `/api/auth/me`               | ✅   | Profile + order/cart stats         |
| GET    | `/api/products`              | –    | List (`?category=&search=&sort=`)  |
| GET    | `/api/products/categories`   | –    | List categories                    |
| GET    | `/api/products/:id`          | –    | Product details                    |
| GET    | `/api/products/:id/reviews`  | –    | Product reviews                    |
| POST   | `/api/products/:id/reviews`  | ✅   | Add/update your review             |
| GET    | `/api/cart`                  | ✅   | Get cart                           |
| POST   | `/api/cart`                  | ✅   | Add item                           |
| PUT    | `/api/cart/:productId`       | ✅   | Set quantity (0 removes)           |
| DELETE | `/api/cart/:productId`       | ✅   | Remove item                        |
| POST   | `/api/orders`                | ✅   | Checkout (transactional)           |
| GET    | `/api/orders`                | ✅   | Order history                      |
| PUT    | `/api/orders/:id/cancel`     | ✅   | Cancel pending order               |

---

Built by [Anubhaw Raj](https://github.com/anubhaw0raj) as a hands-on full-stack project covering React, TypeScript, Node.js, Express and PostgreSQL.
