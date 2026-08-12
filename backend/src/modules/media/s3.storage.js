import path from 'path';
import crypto from 'crypto';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { StorageProvider } from './storage-provider.js';

export class S3StorageProvider extends StorageProvider {
  constructor() {
    super();
    
    if (process.env.NODE_ENV === 'production' && process.env.STORAGE_PROVIDER === 's3') {
      const requiredEnv = ['S3_REGION', 'S3_BUCKET', 'S3_ACCESS_KEY_ID', 'S3_SECRET_ACCESS_KEY'];
      const missing = requiredEnv.filter(key => !process.env[key]);
      
      if (missing.length > 0) {
        console.error(`[FATAL] Missing required S3 environment variables: ${missing.join(', ')}`);
        process.exit(1);
      }
    }

    const config = {
      region: process.env.S3_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || 'dummy',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'dummy'
      }
    };

    if (process.env.S3_ENDPOINT) {
      config.endpoint = process.env.S3_ENDPOINT;
      config.forcePathStyle = true; // Often required for S3-compatible providers like MinIO/DigitalOcean
    }

    this.s3Client = new S3Client(config);
    this.bucket = process.env.S3_BUCKET || 'dummy-bucket';
  }

  async upload(file) {
    // Generate safe filename
    const ext = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${ext}`;
    const storageKey = `uploads/${filename}`;

    let fileBuffer = file.buffer;
    
    // If using disk storage locally but uploading to S3, read the file
    if (!fileBuffer && file.path) {
      const fs = await import('fs/promises');
      fileBuffer = await fs.readFile(file.path);
      // Clean up local temp file after reading
      await fs.unlink(file.path).catch(() => {});
    }

    if (!fileBuffer) {
      throw new Error('Invalid file object: No buffer found');
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: storageKey,
      Body: fileBuffer,
      ContentType: file.mimetype,
      // ACL: 'public-read' // Uncomment if bucket is not public by default and you need object-level public access
    });

    await this.s3Client.send(command);

    return storageKey;
  }

  async delete(storageKey) {
    try {
      if (!storageKey || typeof storageKey !== 'string') return false;

      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: storageKey
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error('S3 delete error:', error.message);
      throw new Error('Failed to delete media from cloud storage');
    }
  }

  getPublicUrl(storageKey) {
    if (process.env.S3_PUBLIC_URL) {
      // E.g. CloudFront URL or custom domain
      return `${process.env.S3_PUBLIC_URL}/${storageKey}`;
    }

    // Default AWS S3 URL
    const region = process.env.S3_REGION || 'us-east-1';
    
    if (process.env.S3_ENDPOINT) {
      // For S3 compatible APIs with forcePathStyle
      return `${process.env.S3_ENDPOINT}/${this.bucket}/${storageKey}`;
    }
    
    return `https://${this.bucket}.s3.${region}.amazonaws.com/${storageKey}`;
  }
}
