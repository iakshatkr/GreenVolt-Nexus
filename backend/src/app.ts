import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import { getDatabaseStatus } from './config/database.js';
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
app.use(
  session({
    name: 'greenvolt.sid',
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  })
);

app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'GreenVolt Nexus API is running',
    data: {
      api: 'online',
      frontendOrigin: env.CLIENT_URL,
      database: getDatabaseStatus()
    }
  });
});

app.use('/api', apiRoutes);
app.use(notFound);
app.use(errorHandler);
