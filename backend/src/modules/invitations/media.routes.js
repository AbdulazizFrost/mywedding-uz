import { Router } from 'express';
import multer from 'multer';
import { uploadMedia, deleteMedia, listMedia } from './media.controller.js';
import { requireAuth } from '../../middlewares/requireAuth.js';

// Setup multer memory storage (we will write it to disk in our LocalStorageProvider)
const storage = multer.memoryStorage();

// Allowed MIME types
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WEBP are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter,
});

const mediaRouter = Router({ mergeParams: true });

mediaRouter.use(requireAuth);

mediaRouter.get('/', listMedia);

// Handle upload errors gracefully
mediaRouter.post('/', (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, uploadMedia);

mediaRouter.delete('/:mediaId', deleteMedia);

export { mediaRouter };
