# 🚀 PriceTrackerPro — Multi-Store Price Aggregator & Alert System

[![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-6.1-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Redis](https://img.shields.io/badge/Redis-7.0-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Celery](https://img.shields.io/badge/Celery-5.6-37B24D?style=for-the-badge&logo=celery&logoColor=white)](https://docs.celeryq.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

PriceTrackerPro is a high-performance, asynchronous web application and automated background worker designed to aggregate real-time product data, compare prices, and track price drops across major Iranian e-commerce stores (**Digikala** & **Technolife**).

Equipped with a token credit system, MD5 Redis caching, automated background price drop alerts via Celery, Persian UTF-8 CSV exports, and full Docker containerization.

---

## 🌟 Key Features

- **⚡ Multi-Engine Parallel Scraping (`ThreadPoolExecutor`):**
  - **Digikala Integration:** Direct JSON consumption from Digikala's internal REST Discovery API (`/discovery/api/v2/search/`).
  - **Technolife Integration:** Server-Side Rendered (SSR) HTML parsing using **`lxml`** to extract embedded Next.js `__NEXT_DATA__` JSON payloads.
- **🛡️ JWT Authentication:** Secure login, registration, token refresh, and Iranian phone number validation.
- **🪙 Token Credit Model:** 10 free credits assigned on registration for search queries.
- **🧠 Smart MD5 Caching (Redis):** Prevents duplicate token consumption on page refreshes or repeated searches within 15 minutes.
- **🔔 Product Watchlist & Price Alerts:** Bookmark items, set custom target prices, and receive automated notifications.
- **🤖 Background Worker (Celery & Beat):** Periodic 6-hour background price checks and automated email alerts on price drops.
- **📊 Persian-Compatible CSV Export:** UTF-8 BOM (`utf-8-sig`) encoded export for seamless Microsoft Excel compatibility.
- **📱 Responsive UI & Filters:** Shimmer loading skeletons, store-specific filters, in-stock toggles, pagination, and clean URL routing.
- **🐳 Full Docker Containerization:** Single-command deployment (`make up`) orchestrating 6 services via Docker Compose.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Python 3.14, Django 6.1, Django REST Framework, SimpleJWT, Gunicorn, WhiteNoise, `lxml` |
| **Frontend** | React 18 (Vite + TypeScript), TailwindCSS, Lucide Icons, Nginx |
| **Database & Cache** | PostgreSQL 15, Redis 7 (django-redis) |
| **Async & Worker** | Celery 5.6, Celery Beat |
| **DevOps** | Docker, Docker Compose, Makefile |

---

## 🔌 API Endpoints Reference

All endpoints are prefixed with `/api/`. Protected endpoints require `Authorization: Bearer <ACCESS_TOKEN>`.

### 🔑 Authentication & Profile (`/api/auth/`)

| Method | Endpoint | Description | Auth Required |
| :---: | :--- | :--- | :---: |
| **POST** | `/api/auth/register/` | Register new user (Phone, Name, Password, Email) | ❌ No |
| **POST** | `/api/auth/login/` | Authenticate & obtain JWT Access and Refresh tokens | ❌ No |
| **GET** | `/api/auth/profile/` | Fetch current user profile & wallet balance | ✅ Yes |
| **POST** | `/api/auth/token/refresh/` | Refresh expired Access token | ❌ No |

### 🪙 Wallet & Search (`/api/`)

| Method | Endpoint | Description | Auth Required |
| :---: | :--- | :--- | :---: |
| **GET** | `/api/wallet/balance/` | Get current token wallet balance | ✅ Yes |
| **POST** | `/api/search/` | Parallel live search across Digikala & Technolife | ✅ Yes |
| **GET** | `/api/search/history/` | Fetch user's recent search history log | ✅ Yes |
| **POST** | `/api/export-csv/` | Generate Persian-compatible UTF-8 BOM CSV export | ✅ Yes |

### 🔔 Watchlist & Price Alerts (`/api/watchlist/`)

| Method | Endpoint | Description | Auth Required |
| :---: | :--- | :--- | :---: |
| **GET** | `/api/watchlist/` | Retrieve user's bookmarked watchlist items | ✅ Yes |
| **POST** | `/api/watchlist/` | Bookmark item and set target price for alerts | ✅ Yes |
| **PATCH** | `/api/watchlist/<id>/` | Update target price or alert status | ✅ Yes |
| **DELETE** | `/api/watchlist/<id>/` | Remove item from watchlist | ✅ Yes |

---

## ⚡ Quick Start Guide

The project is fully containerized with Docker and managed via a root `Makefile`.

```bash
# 1. Build all Docker images
make build

# 2. Spin up all 6 services in background (PostgreSQL, Redis, Backend, Workers, Nginx)
make up

# 3. Apply database migrations & collect static files
make migrate

# 4. Create admin superuser
make createsuperuser
```

### Access Ports:
- **Frontend App:** `http://localhost`
- **Backend API:** `http://localhost:8000/api/`
- **Django Admin:** `http://localhost:8000/admin/`

---

## 🎨 Frontend Note

The frontend user interface was designed with the assistance of **AI-Assisted UI Design tools**, built on top of **React**, **Vite**, and **TailwindCSS** featuring modern glassmorphism, responsive grids, and micro-animations.
