import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import lotteryRoutes from './routes/lottery';
import gamesRoutes from './routes/games';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_VERSION = process.env.API_VERSION || 'v1';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: API_VERSION });
});

// API Routes
app.use(`/${API_VERSION}/api/lottery`, lotteryRoutes);
app.use(`/${API_VERSION}/api/games`, gamesRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`);
  console.log(`[API] Version: ${API_VERSION}`);
});
