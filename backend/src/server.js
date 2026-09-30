import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://127.0.0.1:8000';

// Configure CORS
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || NODE_ENV === 'development' || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure reports directory exists & serve statically
const reportsDir = path.resolve('data/reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}
app.use('/reports', express.static(reportsDir));

// Enhanced health check endpoint
app.get('/health', async (req, res) => {
  let analyticsHealthy = false;
  try {
    const pyHealthRes = await fetch(`${PYTHON_API_URL}/health`, { signal: AbortSignal.timeout(1500) });
    if (pyHealthRes.ok) analyticsHealthy = true;
  } catch (e) {}

  res.json({
    status: 'ok',
    service: 'SnapInsight Backend API',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    services: {
      backend: 'online',
      analyticsMicroservice: analyticsHealthy ? 'online' : 'fallback-local'
    }
  });
});

// Mount API routes
app.use('/api', apiRoutes);

// Static serve Frontend production dist build if present (Must be AFTER /api and /health)
const frontendDist = path.resolve('../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/reports') || req.path === '/health') {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Periodic temporary uploads cleanup (files older than 2 hours)
function cleanupTempFiles() {
  const uploadDir = path.resolve('data/uploads');
  if (fs.existsSync(uploadDir)) {
    const now = Date.now();
    const maxAgeMs = 2 * 60 * 60 * 1000;
    fs.readdir(uploadDir, (err, files) => {
      if (err) return;
      files.forEach((file) => {
        if (file === '.gitkeep') return;
        const filePath = path.join(uploadDir, file);
        fs.stat(filePath, (err, stats) => {
          if (!err && (now - stats.mtimeMs) > maxAgeMs) {
            fs.unlink(filePath, () => {});
          }
        });
      });
    });
  }
}
setInterval(cleanupTempFiles, 30 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 SnapInsight Backend Server running on http://localhost:${PORT}`);
  console.log(`   - Environment: ${NODE_ENV}`);
  console.log(`   - API Health: http://localhost:${PORT}/health`);
  console.log(`   - Analytics Microservice Target: ${PYTHON_API_URL}`);
  console.log(`=======================================================`);
});
