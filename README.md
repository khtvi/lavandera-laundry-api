# Lavandera — Laundry Order Queue API & Frontend

A full-stack laundry queue management web application and REST API built with Node.js, Express, and SQLite (`better-sqlite3`).

---

## Live Deployment

- **Live API URL:** `https://lavandera-laundry-api.onrender.com`  
  *(Replace with your actual Render service URL once deployed)*
- **Endpoints:**
  - `GET /orders` — Retrieve all laundry orders
  - `POST /orders` — Create a new order (requires `x-api-key` header)
  - `PUT /orders/:id` — Update order status (requires `x-api-key` header)
  - `DELETE /orders/:id` — Cancel / remove an order (requires `x-api-key` header)

---

## Features

- **RESTful API**: Fast and light Express routes with rate limiting and centralized error handling.
- **Embedded Database**: Local persistent storage with SQLite (`better-sqlite3`).
- **Full-Stack Queue Interface (`client.html`)**: Beautiful, responsive strawberry & matcha themed UI for managing orders with live updates without full page reloads.
- **CORS Enabled**: Cross-Origin Resource Sharing configured for browser clients.
- **Deployment Ready**: Uses `process.env.PORT || 3000`, absolute `__dirname` paths, and `.env.example`.

---

## Quick Start (Local Setup)

1. **Clone the repository:**
   ```bash
   git clone <YOUR_REPO_URL>
   cd FullOrderQueue
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Ensure `.env` contains:
   ```
   PORT=3000
   API_KEY=laundry-secret-2026
   ```

4. **Initialize database (if needed):**
   ```bash
   node setup.js
   ```

5. **Start server:**
   ```bash
   npm start
   ```
   The server runs at `http://localhost:3000`.

6. **Open frontend:**
   Open `client.html` with VS Code Live Server or navigate to `http://localhost:3000/client.html`.

---

## Deployment (Render)

- **Environment:** Node
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `API_KEY` = `laundry-secret-2026`
