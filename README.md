# ?? Sanjeevani  Smart Crop Care & Direct Market Access Platform

> **"From Crop Care to Market  Your Farming Companion."**

Sanjeevani is a production-grade, mobile-first AgriTech application designed for small and marginal farmers using basic smartphones, regional languages (Telugu, Hindi, English), and low digital literacy.

![Sanjeevani Preview](https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1200&q=80)

---

## ?? Live Production Links

- **Main Website / Farmer App (Vercel)**: [https://frontend-chi-six-yjcuzbprg7.vercel.app](https://frontend-chi-six-yjcuzbprg7.vercel.app)
- **Master Admin Portal (Vercel)**: [https://admin-ecru-tau-64.vercel.app](https://admin-ecru-tau-64.vercel.app)
- **GitHub Repository**: [https://github.com/HitaishiDevarapalli/smart-crop-AI](https://github.com/HitaishiDevarapalli/smart-crop-AI)

---

## ? Key Features

### ?? 1. Camera AI Crop Health & Disease Identification
- **Real Device Camera View**: `getUserMedia` camera feed with leaf framing overlay and flash support.
- **Image Quality Validation**: Rejects blurry (< 35 Laplacian variance) or dark photos with friendly advice.
- **WPF Dataset Model Integration**: Computer vision inference detecting crop type, disease condition (e.g. Early Blight), confidence score (e.g. 94%), and severity level.
- **Step-by-Step Treatment**: Clear preventive steps with **Voice Read-Aloud (Text-To-Speech)** for illiterate farmers.

### ??? 2. Live Weather Intelligence & Daily Farm Plan
- **Live Open-Meteo API**: Real temperature, humidity, wind speed, rain probability, and dynamic farm recommendations.
- **Weather Alerts**: Automated rain, heat stress, and wind warning notifications.
- **Daily Farm Plan ("My Day")**: Morning, Afternoon, Evening interactive routine task manager.

### ?? 3. Market Access, Buyers, FPOs & Cold Storage
- **Live Mandi Prices**: Real rates with +5% trend indicators and source metadata.
- **Sell Produce Listing**: Modal form to publish crop quantities and expected prices.
- **Direct Buyer Directory**: Verified buyer cards (Processor, Exporter, Trader) with direct phone contacts.
- **Cold Storage Leaflet Map**: Interactive OpenStreetMap tracking facility coordinates, distance (8.2 km), available space (500 MT), and daily rates.
- **Transport Logistics**: Transport vehicle booking requests (Bolero 2 Ton / Eicher 5 Ton).

### ?? 4. Farm Worker Coordination Hub
- **Worker Availability Matrix**: Statuses for Harvesting, Planting, Field Cleaning, Spraying with ?? Available, ?? Limited, ?? Unavailable badges.
- **Central Farm Work Coordinator Card**: Coordinator contact card (Venkateswara Rao) with direct Call & WhatsApp messaging.
- **Coordinator Admin View**: Panel to accept/confirm worker requests.

### ?? 5. Sanjeevani AI Voice Assistant
- Interactive chatbot with **Web Speech API Speech-To-Text mic input** and spoken audio output in Telugu, Hindi, and English.

### ?? 6. Full PWA & Offline Support
- **Service Worker & Web Manifest** for home screen installation.
- **IndexedDB Sync Engine**: Caches diagnoses, worker requests, and weather forecasts offline, automatically synchronizing when reconnected.

---

## ??? Technology Stack

### Frontend
- React 19 + TypeScript
- Vite + Tailwind CSS v4
- Framer Motion
- i18next (Telugu, Hindi, English)
- Leaflet + OpenStreetMap
- IndexedDB + PWA

### Backend
- Python FastAPI REST Server
- PyTorch + OpenCV Computer Vision Pipeline (WPF Plant Dataset structure)
- Open-Meteo Weather API
- Supabase PostgreSQL Schema (`backend/database/schema.sql`)

---

## ?? Local Development Setup

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ?? License
MIT License. Built for Small & Marginal Farmers.
