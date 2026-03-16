import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { loggerMiddleware } from './middleware/logger.js';
import { notFound } from './middleware/notFound.js';
import { apiRoutes } from './routes/index.js';

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true
  })
);
app.use(helmet());
app.use(loggerMiddleware);
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'GreenVolt Nexus API is running'
  });
});

app.use('/api', apiRoutes);
app.use(notFound);
app.use(errorHandler);

