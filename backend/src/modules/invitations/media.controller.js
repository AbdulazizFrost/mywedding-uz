import { prisma } from '../../config/database.js';
import { LocalStorageProvider } from '../media/local.storage.js';
import { S3StorageProvider } from '../media/s3.storage.js';

let storageProvider;
if (process.env.STORAGE_PROVIDER === 's3') {
  storageProvider = new S3StorageProvider();
} else {
  storageProvider = new LocalStorageProvider();
}

export const uploadMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const file = req.file;
    const type = req.body.type || 'gallery_item';

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // 1. Validate ownership
    const invitation = await prisma.invitation.findUnique({
      where: { id }
    });

    if (!invitation || invitation.user_id !== user_id) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    // 2. Upload to storage
    const storageKey = await storageProvider.upload(file);
    const url = storageProvider.getPublicUrl(storageKey);

    // 3. Create Media record
    const media = await prisma.media.create({
      data: {
        invitation_id: invitation.id,
        type: type,
        url: url,
        storage_key: storageKey,
        meta: {
          mimetype: file.mimetype,
          size: file.size,
          originalname: file.originalname
        }
      }
    });

    res.status(201).json({ media });
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (req, res, next) => {
  try {
    const { id, mediaId } = req.params;
    const user_id = req.user.id;

    // 1. Find invitation and check ownership
    const invitation = await prisma.invitation.findUnique({
      where: { id }
    });

    if (!invitation || invitation.user_id !== user_id) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    // 2. Find media and verify it belongs to this invitation
    const media = await prisma.media.findUnique({
      where: { id: mediaId }
    });

    if (!media || media.invitation_id !== invitation.id) {
      return res.status(404).json({ error: 'Media not found' });
    }

    // 3. Delete from storage if storage_key exists
    if (media.storage_key) {
      await storageProvider.delete(media.storage_key);
    }

    // 4. Delete from DB
    await prisma.media.delete({
      where: { id: media.id }
    });

    res.status(200).json({ message: 'Media deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const listMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // 1. Verify ownership
    const invitation = await prisma.invitation.findUnique({
      where: { id }
    });

    if (!invitation || invitation.user_id !== user_id) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const media = await prisma.media.findMany({
      where: { invitation_id: id },
      orderBy: { created_at: 'asc' }
    });

    res.status(200).json({ media });
  } catch (error) {
    next(error);
  }
};
