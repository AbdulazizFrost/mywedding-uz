import { isProduction } from '../config/env.js';

// 404 — маршрут не найден
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: {
      message: `Маршрут не найден: ${req.method} ${req.originalUrl}`,
    },
  });
}

// Единый обработчик ошибок (должен быть последним middleware)
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    console.error('[error]', err);
  }

  res.status(status).json({
    error: {
      message: isProduction && status === 500 ? 'Internal Server Error' : err.message,
      ...(isProduction ? {} : { stack: err.stack }),
    },
  });
};
