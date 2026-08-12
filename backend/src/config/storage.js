/**
 * Конфигурация хранилища медиафайлов (S3-compatible / Cloudinary).
 * На Шаге 1 не реализуется — заготовка на будущее.
 */
export const storageConfig = {
  provider: process.env.STORAGE_PROVIDER || 'none',
};
