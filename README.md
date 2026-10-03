# 🌐 CampusNet Optimizer
### College Network Expansion Planner & Minimum Spanning Tree Visualizer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61dafb.svg)](https://reactjs.org/)
[![React Flow](https://img.shields.io/badge/Canvas-React%20Flow%20v12-ff0072.svg)](https://reactflow.dev/)
[![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20CSS-38bdf8.svg)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Express.js-green.svg)](https://nodejs.org/)

**CampusNet Optimizer** is an interactive full-stack network planning tool engineered for university IT directors, campus planners, and hackathon showcases. It models existing campus buildings, plots potential fiber-optic cable routes, and computes the mathematically optimal Minimum Spanning Tree (MST) using **Kruskal's Algorithm** with **Disjoint Set Union (DSU)**.

---

## 🚀 Key Features

* 🖱️ **Interactive React Flow Canvas**: Drag, drop, and connect buildings. Double-click anywhere on the canvas to place a new building.
* ⚡ **One-Click MST Calculation**: Automatically highlights the optimal fiber-optic cable paths in glowing neon green (`#10B981`) with animated signal flow.
* 🔄 **Dual Engine Architecture**:
  * **Client-Side Engine**: Runs Kruskal's algorithm and DSU in-browser for zero-latency, 100% offline support on GitHub Pages.
  * **Express Backend API**: REST endpoint (`POST /api/optimize`) for server-side processing, scalable to massive enterprise campus topologies.
* 🏛️ **Existing Network Backbone**: Pre-unions existing infrastructure (marked in blue). Handles **multiple distinct existing clusters** (e.g., North Campus and South Campus across a river or highway) and computes the cheapest bridge link.
* 💵 **Budget Constraint Controls**: Interactive slider evaluates maximum project budgets. Automatically flags budget overruns in pulsing red and identifies the highest-cost cable runs.
* ⚠️ **Proactive Edge-Case Diagnostics**: Instantly flags isolated/stranded buildings with actionable error notifications.
* 📊 **Bill of Materials (BOM) & JSON Export**: Generates itemized cable run spreadsheets, cost savings percentages, and downloadable JSON topologies.
* 🎨 **Pre-loaded Campus Presets**:
  1. *Engineering & Sciences Quad* (Core campus with dense cable loops)
  2. *Dual Campus Bridge* (North & South hubs requiring optimal inter-campus bridge)
  3. *Stranded Node Edge-Case Demo* (Isolated hilltop observatory testing disconnected graph handling)

---

## 🧠 Algorithmic Foundation

The optimization engine implements **Kruskal's Algorithm** paired with an optimized **Disjoint Set Union (DSU)**:

1. **Path Compression**: Flattens node hierarchies on `find()` queries, achieving near-constant amortized time complexity $\alpha(V)$ (Inverse Ackermann).
2. **Union by Rank**: Always attaches the shallower tree to the root of the deeper tree, preventing unbalanced trees.
3. **Pre-Clustering**: Nodes tagged with `isExisting: true` belonging to the same cluster are pre-unified in the DSU at initialization with $0$ new capital expenditure.
4. **Greedy Edge Selection**: Candidate cable routes are sorted by cost ($O(E \log E)$) and evaluated sequentially. An edge is accepted into the MST if and only if its endpoints belong to different disjoint sets.

---

## 📁 Repository Structure

```text
campusnet-optimizer/
├── frontend/                     # React + Vite + Tailwind CSS + React Flow
│   ├── src/
│   │   ├── algorithms/           # Client-side Kruskal's & DSU engine
│   │   ├── components/           # BuildingNode, CableEdge, Sidebar, Navbar, Canvas
│   │   ├── store/                # Zustand state store
│   │   ├── utils/                # Presets, API client, BOM exporters
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
├── backend/                      # Node.js + Express API
│   ├── src/
│   │   ├── algorithms/           # DSU & Kruskal's solver
│   │   ├── routes/               # POST /api/optimize
│   │   └── server.js             # Express server entry point
│   ├── tests/                    # Automated algorithm unit tests
│   └── package.json
├── .github/workflows/deploy.yml  # Automated GitHub Pages CI/CD workflow
├── package.json                  # Root monorepo scripts
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Run Locally (Full-Stack)

Clone the repository and run:

```bash
# Install frontend dependencies
cd frontend
npm install

# Run the frontend development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 3. Run Backend (Optional)
To test the standalone Express API server:

```bash
# In a separate terminal
cd backend
npm install
npm run dev
```
The backend API starts on `http://localhost:5001`. You can toggle between **Client Engine** and **Express API** in the top navigation bar.

### 4. Run Automated Algorithm Tests

```bash
cd backend
npm test
```

Expected output:
```text
🧪 Starting Kruskal & DSU algorithm test suite...

✅ Test 1: Simple Triangle Graph passed!
✅ Test 2: Existing Network Pre-Union passed!
✅ Test 3: Disconnected Node Detection passed!
✅ Test 4: Multi-Cluster Pre-Union passed!
✅ Test 5: Budget Constraint Detection passed!

🎉 ALL KRUSKAL ALGORITHM & DSU TESTS PASSED SUCCESSFULLY!
```

---

## 🚀 Deployment Guide

### Deploying Frontend to GitHub Pages (Automated)
This repository includes a GitHub Actions workflow in `.github/workflows/deploy.yml`.

1. Push your repository to GitHub on the `main` branch.
2. In your GitHub repository settings, go to **Settings > Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. Every push to `main` will automatically build and publish the application to `https://<username>.github.io/<repo-name>/`.

### Deploying Backend to Render / Railway (Optional)
1. Link your GitHub repository to [Render.com](https://render.com).
2. Create a new **Web Service**.
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Copy the service URL (e.g. `https://campusnet-api.onrender.com`).
5. In your frontend repository settings, set an environment variable:
   ```env
   VITE_API_URL=https://campusnet-api.onrender.com/api
   ```

---

## 🏆 Hackathon Winning Edge Cases

| Challenge | Real-World Scenario | CampusNet Solution |
| :--- | :--- | :--- |
| **Disconnected Node** | An isolated observatory has no feasible route drawn. | DSU flags unreachable components and displays a high-visibility warning notification naming the stranded building. |
| **Multi-Cluster Bridging** | North and South campus already have fiber, but need an inter-campus link. | Pre-unions the existing quads separately; Kruskal's algorithm automatically determines the single cheapest bridge route between them. |
| **Budget Limit** | Dean approves \$1,500 max budget for expansion. | Dynamic slider evaluates MST cost. Exceeding edges glow crimson red and identify the most expensive runs. |

---

## 📜 License
MIT License. Created for campus network optimization and engineering education.
