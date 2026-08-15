import { Router } from 'express';
import multer from 'multer';
import { uploadMedia, deleteMedia, listMedia } from './media.controller.js';
import { requireAuth } from '../../middlewares/requireAuth.js';

// Setup multer memory storage (we will write it to disk in our LocalStorageProvider)
const storage = multer.memoryStorage();

// Allowed MIME types (images + audio)
const allowedMimeTypes = [
  'image/jpeg', 
  'image/png', 
  'image/webp',
  'audio/mpeg', 
  'audio/mp3', 
  'audio/wav', 
  'audio/ogg', 
  'audio/m4a', 
  'audio/aac',
  'audio/x-m4a'
];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WEBP and Audio (MP3, WAV, M4A, OGG) are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB
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
