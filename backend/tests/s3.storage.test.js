import { jest } from '@jest/globals';

process.env.NODE_ENV = 'production';
process.env.STORAGE_PROVIDER = 's3';
process.env.S3_REGION = 'us-east-1';
process.env.S3_BUCKET = 'test-bucket';
process.env.S3_ACCESS_KEY_ID = 'test-key';
process.env.S3_SECRET_ACCESS_KEY = 'test-secret';

// Mock S3Client
const sendMock = jest.fn();
jest.unstable_mockModule('@aws-sdk/client-s3', () => ({
  S3Client: class {
    send = sendMock;
  },
  PutObjectCommand: class {},
  DeleteObjectCommand: class {}
}));

const { S3StorageProvider } = await import('../src/modules/media/s3.storage.js');

describe('S3StorageProvider', () => {
  let provider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new S3StorageProvider();
  });

  describe('upload', () => {
    it('1. Uploads file to S3 and returns storageKey', async () => {
      sendMock.mockResolvedValueOnce({});

      const file = {
        originalname: 'test.jpg',
        buffer: Buffer.from('fake data'),
        mimetype: 'image/jpeg'
      };

      const storageKey = await provider.upload(file);

      expect(storageKey).toMatch(/^uploads\/[a-z0-9-]+\.jpg$/);
      expect(sendMock).toHaveBeenCalled();
    });

    it('2. Throws error if file buffer is missing', async () => {
      const file = { originalname: 'test.jpg', mimetype: 'image/jpeg' };
      
      await expect(provider.upload(file)).rejects.toThrow('Invalid file object: No buffer found');
    });
  });

  describe('delete', () => {
    it('3. Deletes object from S3', async () => {
      sendMock.mockResolvedValueOnce({});
      
      const result = await provider.delete('uploads/test.jpg');
      
      expect(result).toBe(true);
      expect(sendMock).toHaveBeenCalled();
    });

    it('4. Returns false if storageKey is empty', async () => {
      const result = await provider.delete('');
      expect(result).toBe(false);
      expect(sendMock).not.toHaveBeenCalled();
    });
  });

  describe('getPublicUrl', () => {
    it('5. Generates standard AWS S3 URL', () => {
      delete process.env.S3_ENDPOINT;
      delete process.env.S3_PUBLIC_URL;
      
      const providerStandard = new S3StorageProvider();
      const url = providerStandard.getPublicUrl('uploads/test.jpg');
      
      expect(url).toBe('https://test-bucket.s3.us-east-1.amazonaws.com/uploads/test.jpg');
    });

    it('6. Uses S3_PUBLIC_URL if provided', () => {
      process.env.S3_PUBLIC_URL = 'https://cdn.example.com';
      
      const providerCdn = new S3StorageProvider();
      const url = providerCdn.getPublicUrl('uploads/test.jpg');
      
      expect(url).toBe('https://cdn.example.com/uploads/test.jpg');
      
      delete process.env.S3_PUBLIC_URL;
    });

    it('7. Uses S3_ENDPOINT for compatible providers', () => {
      process.env.S3_ENDPOINT = 'https://s3.eu-central-1.wasabisys.com';
      
      const providerWasabi = new S3StorageProvider();
      const url = providerWasabi.getPublicUrl('uploads/test.jpg');
      
      expect(url).toBe('https://s3.eu-central-1.wasabisys.com/test-bucket/uploads/test.jpg');
    });
  });
});
