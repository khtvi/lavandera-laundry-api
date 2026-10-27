# Deployment Health Check & Field Notes

**Student Name:** Giselle Dinglasan  
**Course:** Human-Computer Interaction | Week 13, Meeting 2  
**Service Name:** `lavandera-laundry-api` (Render Web Service)  
**Date:** October 27, 2026  

---

## 1. Live Render URL

- **Live URL:** `https://lavandera-laundry-api.onrender.com`
- **Dashboard Service:** Web Service on Render (Free Tier, Region: Singapore / Oregon)
- **Root / Queue Page:** `https://lavandera-laundry-api.onrender.com/client.html`

---

## 2. GET Request Against Live URL

- **Request:**
  ```http
  GET https://lavandera-laundry-api.onrender.com/orders HTTP/1.1
  Host: lavandera-laundry-api.onrender.com
  ```
- **Response Status:** `200 OK`
- **Response Body:**
  ```json
  [
    {
      "id": 1,
      "customerName": "Maria Santos",
      "loadCount": 2,
      "status": "Pending",
      "dropOffTime": "8:00 AM"
    },
    {
      "id": 2,
      "customerName": "Pedro Reyes",
      "loadCount": 1,
      "status": "Washing",
      "dropOffTime": "9:15 AM"
    },
    {
      "id": 3,
      "customerName": "Ana Cruz",
      "loadCount": 3,
      "status": "Ready for Pickup",
      "dropOffTime": "7:30 AM"
    }
  ]
  ```
- **Notes:** The first request took ~50 seconds due to Render's free tier instance spin-up from cold sleep. Subsequent requests returned in <120ms.

---

## 3. POST Request Against Live URL

- **Request:**
  ```http
  POST https://lavandera-laundry-api.onrender.com/orders HTTP/1.1
  Host: lavandera-laundry-api.onrender.com
  Content-Type: application/json
  x-api-key: laundry-secret-2026

  {
    "customerName": "Liza Gomez",
    "loadCount": 2,
    "status": "Pending",
    "dropOffTime": "10:30 AM"
  }
  ```
- **Response Status:** `201 Created`
- **Response Body:**
  ```json
  {
    "id": 4,
    "customerName": "Liza Gomez",
    "loadCount": 2,
    "status": "Pending",
    "dropOffTime": "10:30 AM"
  }
  ```
- **Notes:** The order was successfully inserted and assigned auto-increment ID 4. Re-querying `GET /orders` confirmed the record was present in the live queue.

---

## 4. What Happened to Data After a Redeploy, and Why

- **Observation:** After pushing an update to GitHub, Render triggered an automatic rebuild and redeploy. Upon re-querying `GET /orders`, the newly added order (Liza Gomez, ID 4) had vanished, and the database was reset to only the initial repository state.
- **Why This Happened (In Plain Words):** Render's free tier web services run inside stateless, ephemeral Docker containers. The container's local file system is temporary—every time a new build occurs, a service restarts, or the container sleeps and wakes up, the container disk is destroyed and rebuilt from scratch from Git. Any files written at runtime, such as the local SQLite `laundry.db` file, are completely discarded.

---

## 5. How a Real Company Prevents Data Loss

- **Professional Solution:** In production environments, companies never store dynamic application data in a local SQLite file on ephemeral container storage; instead, they connect their API to an external, managed cloud database service (such as Supabase, Render PostgreSQL, AWS RDS, or PlanetScale) or attach a dedicated persistent cloud disk volume that survives redeploys and restarts.
