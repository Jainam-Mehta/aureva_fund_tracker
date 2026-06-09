# Aureva Mutual Fund Insight Tracker (Full-Stack MERN)

### Live Application URLs
- 🚀 **Frontend (Live App URL):** [https://vercel.app]([https://vercel.app](https://aureva-fund-tracker.vercel.app)
- ⚙️ **Backend API Service Base:** [https://onrender.com](https://onrender.com](https://aureva-fund-tracker.onrender.com)
- 📦 **Public Git Repository:** [https://github.com](https://github.com/Jainam-Mehta/aureva_fund_tracker)

---

## 📌 Project Overview
Aureva Fund Insight Tracker is a high-performance mini full-stack MERN application that allows authenticated users to securely search for Indian Mutual Funds, curate a persistent personal tracking watchlist stored in the cloud, and render highly fluid historical net asset value (NAV) trend analysis line graphs.

The application communicates exclusively with the free, public **MFapi.in** infrastructure through a custom-built fault-tolerant backend proxy engine.

---

## 🎁 Implemented Bonus Objectives & Key Engineering Highlights

- **⚡ [BONUS OBJECTIVE] Upstream Performance Cache Tier:** Implements a strict 1-hour in-memory server cache proxy using a native JavaScript `Map` data structure. This prevents redundant high-volume data fetches for identical scheme codes, dramatically cutting down network latency while respecting public API rate-limiting thresholds.
- **⏱️ Optimized Frontend Debouncing:** Enforces a customized 400ms debounce threshold window on the dashboard search input field. This regulates network request overhead, ensuring search queries dispatch only when a user finishes typing.
- **🛡️ Distributed Fault-Tolerance Bypass:** Outbound server requests route dynamically through an authoritative web proxy middleman layer (`api.allorigins.win`). This architecture fully resolves and bypasses local network lookup limitations such as cellular carrier DNS resolution blocks (`getaddrinfo ENOTFOUND`).
- **📈 Chronological Chart Normalization:** Historical metrics provided by the public endpoint arrive in a newest-first layout structured as raw string dates (`dd-mm-yyyy`). The application features a defensive sorting map that transforms strings into chronological UNIX timestamps for accurate left-to-right line chart rendering inside **Recharts**.
- **🔒 Compound Security Duplication Constraints:** Watchlist persistence is reinforced at the database tier using a Mongoose-level compound unique index on `{ userId: 1, schemeCode: 1 }`. This guarantees that duplicate scheme codes are strictly blocked per individual profile layer without restricting other users from tracking the same asset.

---

## 📂 Directory Structure

```text
aureva_fund_tracker/
├── backend/            # Node.js & Express REST API Engine
│   ├── middleware/     # Cryptographic JWT Protection Layer
│   ├── models/         # Mongoose User & Watchlist Schemas
│   ├── routes/         # Auth Controllers, Watchlist Aggregators, & Fund Proxies
│   └── server.js       # App Bootstrapper & DNS Resolver Overrides
└── frontend/           # React Client App Workspace (Vite Engine)
    └── src/
        ├── components/ # Shared Application Layout Elements (Navbar)
        ├── context/    # Global Authentication Profile State Provider
        └── pages/      # Home Dashboard, Login Gateway, Watchlist, & Analytics Views
```

## 🛠️ Local Installation & Bootstrapping Guide

### Prerequisites
- Node.js runtime framework installed (v18 or higher recommended)
- Active network access to connect to the MongoDB Atlas cloud cluster

### Step 1: Bootstrapping the Backend Server
```bash
cd backend
npm install
npm run dev
```
*The server will initialize and print:*
```text
[nodemon] starting `node server.js`
Successfully connected to MongoDB Atlas (aureva_tracker)!
Server executing safely on port 5000
```

### Step 2: Spinning Up the Frontend Web UI
Open a secondary independent terminal instance window:
```bash
cd frontend
npm install
npm run dev
```
*Navigate your browser window to `http://localhost:5173/` to interact with the system locally.*

---

## ⚠️ Known Constraints & Assumptions
- **Stateless Server Storage Caching:** The 1-hour bonus historical proxy caching collection lives completely in-memory on the active Node runtime engine. Restarting or redeploying the cloud web service container completely flushes the temporary memory state maps cleanly.
- **Third-Party Structural Upstream Dependency:** The frontend time-series visualization module assumes that historical dataset parameters returned by `api.mfapi.in` contain valid numerical tokens. Empty string keys or missing value arrays fallback into graceful, empty information indicators on the charts without crashing the DOM.
