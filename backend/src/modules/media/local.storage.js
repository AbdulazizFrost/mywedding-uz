import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { StorageProvider } from './storage-provider.js';

const UPLOADS_DIR = path.resolve(process.cwd(), 'public/uploads');

export class LocalStorageProvider extends StorageProvider {
  async upload(file) {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    
    // Generate safe filename
    const ext = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${ext}`;
    const destinationPath = path.join(UPLOADS_DIR, filename);

    // If using multer with MemoryStorage, file.buffer exists. 
    // If using DiskStorage, file.path exists and we could just rename.
    // We'll assume multer handles writing it to UPLOADS_DIR if configured,
    // but just in case we are doing it manually from memory:
    if (file.buffer) {
      await fs.writeFile(destinationPath, file.buffer);
    } else if (file.path) {
      // It's already written by multer DiskStorage, just rename it
      await fs.rename(file.path, destinationPath);
    } else {
      throw new Error('Invalid file object');
    }

    return `uploads/${filename}`;
  }

  async delete(storageKey) {
    try {
      // Security check to avoid path traversal
      if (storageKey.includes('..') || !storageKey.startsWith('uploads/')) {
        return false;
      }
      
      const filename = storageKey.replace('uploads/', '');
      const filePath = path.join(UPLOADS_DIR, filename);
      
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      console.error('Local storage delete error:', error);
      return false;
    }
  }

  getPublicUrl(storageKey) {
    // Determine base URL (e.g. from env, default localhost:5000)
    const baseUrl = process.env.API_URL || 'http://localhost:5000';
    return `${baseUrl}/${storageKey}`;
  }
}
