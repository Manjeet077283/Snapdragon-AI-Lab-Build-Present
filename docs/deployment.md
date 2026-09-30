# SnapInsight — Production Deployment & Cloud Hosting Guide

## 1. Overview
SnapInsight utilizes a hybrid microservice architecture designed for seamless cloud deployment:
1. **Frontend**: React + Vite + Tailwind CSS deployed to **Netlify** (or Vercel).
2. **Backend**: Node.js + Express API server deployed to **Render** (or Railway).
3. **Analytics Microservice**: Python + FastAPI + Pandas service deployed to **Render** (or AWS ECS/Fly.io).

---

## 2. Environment Variables Configuration

### Frontend (`frontend/.env.production`)
```env
VITE_API_URL=https://snapinsight-backend.onrender.com
VITE_LOCAL_SNAPDRAGON_URL=http://localhost:5050
```

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://snapinsight.netlify.app
PYTHON_API_URL=https://snapinsight-analytics.onrender.com
DATABASE_URL=sqlite:///data/snapinsight.db
CLOUD_AI_API_KEY=
```

### Analytics (`analytics/.env`)
```env
PORT=8000
HOST=0.0.0.0
```

---

## 3. Step-by-Step Deployment Instructions

### A. Deploy Frontend on Netlify
1. Connect your GitHub repository to **Netlify**.
2. Set **Base directory**: `frontend`
3. Set **Build command**: `npm run build`
4. Set **Publish directory**: `frontend/dist`
5. Configure environment variables in Netlify UI:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://snapinsight-backend.onrender.com`).
6. Deploy! The included `netlify.toml` automatically handles SPA routing redirects (`/* -> /index.html 200`).

### B. Deploy Python Analytics Microservice on Render
1. Create a **New Web Service** on Render pointing to your repository.
2. Select **Python** runtime.
3. Set **Root directory**: `analytics`
4. Set **Build command**: `pip install -r requirements.txt`
5. Set **Start command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`
6. Verify deployment at: `https://your-analytics.onrender.com/health` -> `{"status":"ok","service":"snapinsight-analytics"}`.

### C. Deploy Node.js Express Backend on Render
1. Create a **New Web Service** on Render.
2. Select **Node** runtime.
3. Set **Root directory**: `backend`
4. Set **Build command**: `npm install`
5. Set **Start command**: `npm start`
6. Add environment variables:
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://snapinsight.netlify.app`
   - `PYTHON_API_URL`: `https://your-analytics.onrender.com`
7. Verify deployment at: `https://your-backend.onrender.com/health`.

---

## 4. Multi-Container Deployment with Docker Compose

For on-premises, staging, or unified server environments:
```bash
# Build and run all three services concurrently
docker-compose up --build -d
```

### Port Mapping:
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **Analytics API**: `http://localhost:8000`
- **Health Checks**:
  - `http://localhost:5000/health`
  - `http://localhost:8000/health`

---

## 5. Production Pre-Flight Checklist
- [x] Production build passes without errors (`npm run build`).
- [x] No `localhost` URLs hardcoded in frontend source code (`import.meta.env.VITE_API_URL` utilized).
- [x] CORS restricted to `FRONTEND_URL` in production mode.
- [x] File upload size capped at 50MB with file type validation.
- [x] Temporary uploads directory automatically purged every 30 minutes.
- [x] No secrets committed to source control (`.env` in `.gitignore`).
