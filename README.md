<div align="center">

# 🌿 EcoMap

**City Waste Mapping & Awareness Platform**

A crowd-sourced platform for real-time waste reporting, mapping, and cleanup tracking.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=flat-square&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

<br />

<img src="https://img.shields.io/badge/-%F0%9F%97%BA%EF%B8%8F%20Report%20%E2%86%92%20Map%20%E2%86%92%20Clean-1A5632?style=for-the-badge" alt="Report → Map → Clean" />

</div>

---

## The Problem

Urban areas generate **thousands of tonnes** of waste daily, yet much of it remains unreported. Citizens see illegal dumping but have no quick way to flag it. Municipal bodies lack real-time visibility into waste hotspots, leading to slow response times and growing health hazards.

## The Solution

**EcoMap** bridges this gap with a simple loop:

```
👁️ Spot  →  📍 Pin  →  📸 Snap  →  ✅ Done
```

Citizens report waste in **under 30 seconds**. Authorities see it on a **live map**. Volunteers track **cleanup progress**. Everyone wins.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🗺️ Live Waste Map
- Color-coded markers: 🔴 Unresolved 🟡 In Progress 🟢 Cleaned
- Filter by status with one click
- Click any marker for full details
- Detail sidebar with image, description, reporter

</td>
<td width="50%">

### 📝 Quick Reporting
- Tap-to-pin location on interactive map
- GPS auto-detect with manual adjust
- Photo upload with drag-and-drop
- Waste type classification (6 categories)

</td>
</tr>
<tr>
<td width="50%">

### 🛠️ Admin Panel
- Searchable, filterable report table
- Inline status updates via dropdown
- Aggregate stats + waste type breakdown
- View details modal + delete invalid reports

</td>
<td width="50%">

### 🎨 Modern UI/UX
- Glassmorphic buttons with shine sweep
- Typewriter effect on key headings
- Draggable card stack for recent reports
- Responsive across mobile & desktop

</td>
</tr>
</table>

---

## 🧰 Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Frontend** | React 18 · Vite 6 · Tailwind CSS |
| **Maps** | Leaflet.js · React-Leaflet · OpenStreetMap |
| **Backend** | Node.js · Express.js |
| **Database** | SQLite (better-sqlite3) |
| **Uploads** | Multer (local storage) |
| **Fonts** | DM Serif Display · Inter · JetBrains Mono |

> **Zero external services.** No API keys, no cloud dependencies. Runs entirely local.

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/Oxyrine/EcoMap.git
cd EcoMap

# Install
npm install

# Seed demo data (15 sample reports)
npm run seed

# Start (backend + frontend)
npm run dev
```

Open **http://localhost:5174** and you're in.

---

## 📡 API Reference

| Method | Endpoint | Description |
|:-------|:---------|:------------|
| `POST` | `/api/reports` | Submit a new waste report (multipart form) |
| `GET` | `/api/reports` | Fetch all reports |
| `GET` | `/api/reports/:id` | Get a single report |
| `PATCH` | `/api/reports/:id` | Update report status |
| `DELETE` | `/api/reports/:id` | Delete a report |
| `GET` | `/api/stats` | Aggregated statistics |

---

## 📁 Project Structure

```
EcoMap/
├── server.js                # Express API + SQLite
├── seed.js                  # Demo data seeder
├── vite.config.js           # Vite + proxy config
├── index.html               # Entry point
├── src/
│   ├── App.jsx              # Router + global context
│   ├── index.css            # Animations, glass, gradients
│   ├── components/
│   │   ├── Navbar.jsx       # Scroll-aware transparent nav
│   │   ├── MapView.jsx      # Reusable Leaflet map
│   │   ├── CardStack.jsx    # Draggable stacked cards
│   │   ├── GlassyButton.jsx # Frosted glass buttons
│   │   ├── Typewriter.jsx   # Typing/deleting effect
│   │   ├── StatusBadge.jsx  # Colored status pills
│   │   └── Toast.jsx        # Notification system
│   └── pages/
│       ├── Home.jsx         # Hero, stats, map preview
│       ├── ReportWaste.jsx  # Report form + map picker
│       ├── MapDashboard.jsx # Full-screen map + filters
│       └── AdminPanel.jsx   # Admin table + controls
├── uploads/                 # Stored images
├── data/                    # SQLite database (auto-created)
└── project report/          # Word document report
```

---

## 🎯 Demo Flow

> Perfect for hackathon presentations:

1. **Open the map** — 15 pre-loaded reports appear with color-coded markers
2. **Submit a report** — Pin a location, snap a photo, pick waste type, submit
3. **Watch it appear** — New red marker shows up on the live map instantly
4. **Admin updates** — Change status to "In Progress" → marker turns yellow
5. **Mark cleaned** — Status goes green → visible impact on the map

---

## 🔮 Future Scope

- 🤖 AI-based waste classification from uploaded photos
- 🔐 User authentication with reporter profiles & leaderboard
- 🔔 Push notifications on status changes
- 🌡️ Heatmap layer for waste density visualization
- 📊 Analytics dashboard with trend charts
- 🛣️ Route optimization for cleanup teams
- 📱 Progressive Web App (PWA) with offline support
- 🌐 Multi-language support (Hindi + regional)

---

<div align="center">

**Built for a cleaner world, one report at a time.**

<sub>Made with 💚 for the city we live in</sub>

</div>
