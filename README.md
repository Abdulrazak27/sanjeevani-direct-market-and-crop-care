# 🌿 Sanjeevani — Direct Market & Crop Care
> **"From Crop Care to Market — Your Complete Smart Farming & Direct Trade Companion."**

[![Live App](https://img.shields.io/badge/Live%20App-Vercel-success?style=for-the-badge&logo=vercel)](https://frontend-chi-six-yjcuzbprg7.vercel.app)
[![Admin Portal](https://img.shields.io/badge/Admin%20Portal-Vercel-blue?style=for-the-badge&logo=vercel)](https://admin-ecru-tau-64.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Abdulrazak27/sanjeevani-direct-market-and-crop-care)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📌 Overview

**Sanjeevani** is an all-in-one AgriTech platform built to empower small, marginal, and commercial farmers. It bridges the gap between field pathology and direct commercial trade by pairing **AI-driven plant pathology detection** with **direct market linkages**, **cold storage infrastructure**, and a **transparent 20% advance contract payment escrow system**.

Designed mobile-first with high-contrast accessibility, regional language support (**Telugu, Hindi, English**), offline resilience, and voice read-aloud capabilities for farmers of all literacy levels.

---

## 🚀 Key Feature Modules

### 🔬 1. AI Crop Health Diagnostics & Leaf Pathology
- **Live Device Camera Integration**: Real-time camera viewfinder with leaf-centering target reticle and flash/torch control.
- **Image Quality & Blur Check**: Instant Laplacian variance check preventing blurry (< 35 variance) or poorly lit scans before submission.
- **Neural Network Detection**: Accurately detects diseases across Tomato, Chilli, Cotton, Rice, and Pulses (e.g. *Early Blight, Powdery Mildew, Leaf Curl, Bacterial Spot*) with confidence scoring and severity indicators (*Healthy, Mild, Moderate, Severe*).
- **Prescription & Voice Read-Aloud**: Step-by-step organic remedies and chemical treatments with multi-lingual Text-To-Speech (TTS) audio narration.
- **Admin Review & Deletion**: Dedicated agronomist verification panel with one-click permanent deletion, confirmation modals, immediate UI reactivity, and immutable audit logs.

### 💰 2. Direct Market Access & 20% Advance Payment System
- **Real-Time Mandi Rates**: Live AP & Telangana agricultural commodity rates with percentage trends and market sentiment tags.
- **Produce Listings & Buyer Directory**: Direct connection with verified institutional buyers, food processors, and wholesalers.
- **20% Advance Payment Rule**:
  - Automatically calculates the required 20% commitment advance:  
    $$\text{Required Advance} = \text{Total Contract Amount} \times 20\%$$
  - Real-time financial breakdown: Total Contract Value, Required 20% Advance, Amount Paid, Remaining Balance, and Payment Status (*Unpaid, Partially Paid, Paid*).
  - Dynamic payment recording with multi-channel support (Direct Bank NEFT/RTGS, UPI Instant Pay, Mandi Escrow).

### ❄️ 3. Cold Storage Network & Transport Logistics
- **Interactive Geo-Location Map**: OpenStreetMap Leaflet integration pinpointing certified cold storage facilities with real-time capacity (MT), distance calculations, and pricing per quintal/month.
- **Cold Storage 20% Advance Booking**: Dynamic booking flow with instant 20% advance calculation and admin offline receipt generation.
- **Rural Transport Logistics**: Direct booking of farm transport vehicles (Bolero 2 Ton / Eicher 5 Ton) connecting farm gates to mandis and cold chain hubs.

### 🌦️ 4. Hyperlocal Weather Intelligence & Farm Routine
- **Live Open-Meteo Integration**: Dynamic temperature, humidity, wind velocity, and precipitation probability.
- **Extreme Weather Warnings**: Real-time alerts for heavy rainfall, extreme heat stress, and pest susceptibility windows.
- **"My Day" Task Coordinator**: Morning, afternoon, and evening farm routine task scheduler.
- **Agricultural Labor Hub**: Availability tracking for harvesting, transplanting, field preparation, and spraying labor.

### 🛡️ 5. Master Admin Panel & Audit Engine
- **Cross-Tab Bidirectional Synchronization**: State updates across farmer apps and admin portals synchronize in real-time via custom browser events and persistent disk storage.
- **Live Web CMS**: Instant publishing of emergency monsoon alerts, support hotlines, and mandi rate adjustments without re-deploying code.
- **Security & KYC Verification**: Identity document verification (Aadhaar, Land Pattadar Passbook, Buyer Trade Licenses).
- **Role-Based Admin Protection**: Strict authentication gates preventing unauthorized operations.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons |
| **Mapping & Visuals** | Leaflet, React-Leaflet, OpenStreetMap |
| **Accessibility & i18n** | i18next, React-i18next (English, Telugu, Hindi), Web Speech API |
| **Offline & Storage** | IndexedDB (`idb`), LocalStorage Event Bus, HTML5 PWA |
| **Backend & APIs** | Node.js, Express.js, RESTful Endpoints, Open-Meteo API |
| **Database** | JSON Document Store (`sanjeevani_db.json`), SQLite (`sanjeevani.db`) |
| **Deployment** | Vercel (Edge Network) & GitHub CI/CD |

---

## 📁 Repository Structure

```
smart-crop-AI/
├── frontend/                  # Main Farmer & Marketplace Web Application
│   ├── src/
│   │   ├── components/        # Header, BottomNav, CameraModal, VoiceReader
│   │   ├── pages/             # Home, CropCheck, Market, Weather, AdminDashboard
│   │   ├── services/          # sharedStore.ts, api.ts, offlineDb.ts
│   │   └── i18n/              # Translations (en, te, hi)
│   ├── public/                # Manifest, PWA icons, assets
│   └── vercel.json            # Frontend deployment configuration
├── admin/                     # Standalone Master Admin Management Console
│   ├── src/
│   │   ├── App.tsx            # Full-featured Admin Dashboard & Diagnostic Suite
│   │   └── sharedStore.ts     # Synchronized master data management
│   └── vercel.json            # Admin portal deployment configuration
├── backend/                   # Python FastAPI & SQLite data microservice
│   ├── database/              # Schema, seed scripts, SQLite DB
│   └── routers/               # Microservice routers
├── database/                  # Primary production JSON persistence store
│   └── sanjeevani_db.json     # Single source of truth records
├── server.js                  # Express API server with audit logging & REST endpoints
├── vercel.json                # Root monorepo deployment build rules
└── README.md                  # Project documentation
```

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/Abdulrazak27/sanjeevani-direct-market-and-crop-care.git
cd sanjeevani-direct-market-and-crop-care
```

### 2. Start the Backend Server
```bash
# Install root dependencies
npm install

# Launch API server on port 3000
node server.js
```

### 3. Run the Main Farmer Web Application
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

### 4. Run the Standalone Admin Panel
```bash
cd ../admin
npm install
npm run dev
# Running on http://localhost:5174
```

---

## 🌐 Deploy to Vercel

1. Fork or import this repository on [Vercel](https://vercel.com/new).
2. Set **Project Name** to:
   ```
   sanjeevani-direct-market-and-crop-care
   ```
3. Framework Preset: **Vite**
4. Root Directory: `./` (Vercel automatically detects `vercel.json` and runs the production build).
5. Click **Deploy**!

---

## 👥 Authors & Acknowledgments

- **Lead Developer**: [Abdul Razak](https://github.com/Abdulrazak27)
- **Project**: Sanjeevani — Direct Market & Crop Care
- **Initiative**: Empowering Indian Agriculture through Artificial Intelligence and Transparent Direct Procurement.
