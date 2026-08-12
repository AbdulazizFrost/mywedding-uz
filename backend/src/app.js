import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { requestLogger } from './middlewares/requestLogger.js';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { templatesRouter } from './modules/templates/templates.routes.js';
import { ordersRouter } from './modules/orders/orders.routes.js';
import { devRouter } from './modules/dev/dev.routes.js';
import { invitationsRouter } from './modules/invitations/invitations.routes.js';
import { publicRouter } from './modules/public/public.routes.js';
import { paymentsRouter } from './modules/payments/payments.routes.js';

export function createApp() {
  const app = express();

  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" } // allow public images from other domains if needed
  }));

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  app.use(cors({
    origin: frontendUrl,
    credentials: true,
  }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(requestLogger);

  // Serve uploads statically in dev
  app.use('/uploads', express.static(path.resolve(process.cwd(), 'public/uploads')));

  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'mywedding-api',
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/templates', templatesRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/invitations', invitationsRouter);
  app.use('/api/public', publicRouter);
  app.use('/api/payments', paymentsRouter);

  if (process.env.NODE_ENV === 'development') {
    app.use('/api/dev', devRouter);
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
