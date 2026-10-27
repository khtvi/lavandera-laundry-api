# Deployment Readiness Report

**Project:** Lavandera Laundry API  
**Course:** Human-Computer Interaction | Week 13, Meeting 1  
**Student:** Giselle Dinglasan  
**Date:** October 27, 2026  

---

## Deployment Readiness Checklist

- [x] **PORT uses `process.env.PORT`, not a hardcoded number.**
  - **Implementation:** `const PORT = process.env.PORT || 3000;` in `server.js`.
  - **Verification:** Verified locally with default port `3000` and verified custom environment assignment (`PORT=4000 node server.js`), binding correctly to both.
  - **Why it matters:** Cloud hosting providers (e.g., Render, Railway, Heroku) dynamically assign custom ports at container startup via the `PORT` environment variable. Hardcoded ports prevent the host router from routing external web traffic to the application.

- [x] **Database path uses `__dirname`, not just the file name.**
  - **Implementation:** Added `const path = require('path');` and configured SQLite database initialization as:
    ```javascript
    const db = new Database(path.join(__dirname, 'laundry.db'));
    ```
  - **Verification:** Successfully executed queries against `laundry.db` regardless of the shell's active working directory.
  - **Why it matters:** Cloud platforms frequently start Node applications from different root directories or container working directories. Using `path.join(__dirname, 'laundry.db')` guarantees an absolute path relative to the script location, avoiding accidental creation of empty databases in wrong folders.

- [x] **`package.json` has a working `"start"` script.**
  - **Implementation:**
    ```json
    "scripts": {
      "start": "node server.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    }
    ```
  - **Verification:** Ran `npm start` in the terminal; the process started `node server.js` and printed `Server running at http://localhost:3000`.
  - **Why it matters:** PaaS deployment engines look for `npm start` by default to spin up production application instances.

- [x] **`.gitignore` excludes `node_modules` and `.env`.**
  - **Implementation:** `.gitignore` includes:
    ```
    .env
    node_modules
    .DS_Store
    ```
  - **Verification:** Confirmed via `git status` that `.env` and `node_modules/` are not tracked or staged for Git commits.
  - **Why it matters:** Prevents secret credentials (`API_KEY`) from leaking into public/private source repositories, and prevents thousands of platform-dependent binary dependencies from bloating repository storage.

- [x] **`.env.example` exists, with no real secret values.**
  - **Implementation:** Created `.env.example` containing dummy template definitions:
    ```
    PORT=3000
    API_KEY=your-api-key-here
    ```
  - **Verification:** Inspected file to confirm real production keys (`laundry-secret-2026`) are excluded.
  - **Why it matters:** Provides developers and hosting platforms a clear template of required environment variables without compromising actual credentials.

- [x] **Fresh clone test passed:**
  - **Test Performed:** Simulated a fresh clone environment by verifying dependency restoration via `npm install` and executing `npm start`.
  - **Result:** Successfully installed dependencies and launched the API server without missing packages or runtime syntax exceptions.

---

## Live Instructor Demonstration Steps

1. Delete or rename `node_modules` (or demonstrate fresh install):
   ```powershell
   Remove-Item -Recurse -Force node_modules
   ```
2. Reinstall dependencies cleanly:
   ```powershell
   npm install
   ```
3. Start the application via the standard start script:
   ```powershell
   npm start
   ```
4. Confirm terminal logs:
   `Server running at http://localhost:3000`
