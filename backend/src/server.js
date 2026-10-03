import express from 'express';
import cors from 'cors';
import optimizeRouter from './routes/optimize.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api', optimizeRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'CampusNet Optimizer Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CampusNet Optimizer API. Use POST /api/optimize to calculate network MST.',
    endpoints: {
      health: 'GET /api/health',
      optimize: 'POST /api/optimize'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CampusNet Optimizer API running on port ${PORT}`);
  console.log(`📡 Ready for MST calculations at http://localhost:${PORT}/api/optimize`);
});
