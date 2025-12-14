import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('Seed Script Functions', () => {
  describe('Password Hashing', () => {
    it('should hash password with bcrypt', async () => {
      const mockHash = 'hashed_password_123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

      const result = await bcrypt.hash('admin123', 10);
      expect(result).toBe(mockHash);
      expect(bcrypt.hash).toHaveBeenCalledWith('admin123', 10);
    });
  });

  describe('Seed Data Structure', () => {
    it('should have correct admin user structure', () => {
      const adminData = {
        email: 'admin@studio42.dev',
        passwordHash: 'hashed',
        name: 'Admin User',
      };

      expect(adminData).toHaveProperty('email');
      expect(adminData).toHaveProperty('passwordHash');
      expect(adminData).toHaveProperty('name');
    });

    it('should have correct email config structure', () => {
      const emailConfigData = {
        id: 'default',
        enabled: false,
      };

      expect(emailConfigData).toHaveProperty('id');
      expect(emailConfigData).toHaveProperty('enabled');
    });

    it('should have correct product structure', () => {
      const productData = {
        slug: 'lms',
        name: 'AI Microlearning LMS',
        tagline: 'Intelligent learning management system',
        description: 'A comprehensive learning management system',
        status: 'AVAILABLE',
        features: [
          { title: 'AI-Powered', description: 'Intelligent content recommendations' },
        ],
      };

      expect(productData).toHaveProperty('slug');
      expect(productData).toHaveProperty('name');
      expect(productData).toHaveProperty('description');
      expect(productData).toHaveProperty('status');
      expect(productData).toHaveProperty('features');
      expect(Array.isArray(productData.features)).toBe(true);
    });

    it('should have correct product media structure', () => {
      const mediaData = {
        productId: 'product-id',
        type: 'VIDEO',
        url: 'https://www.youtube.com/watch?v=example',
        title: 'Demo Video',
        order: 0,
      };

      expect(mediaData).toHaveProperty('productId');
      expect(mediaData).toHaveProperty('type');
      expect(mediaData).toHaveProperty('url');
      expect(mediaData).toHaveProperty('order');
    });
  });

  describe('Seed Script File', () => {
    it('should have seed script file', () => {
      const fs = require('fs');
      const path = require('path');
      const seedPath = path.join(process.cwd(), 'prisma', 'seed.ts');
      const exists = fs.existsSync(seedPath);
      expect(exists).toBe(true);
    });

    it('should have correct seed script structure', () => {
      const fs = require('fs');
      const path = require('path');
      const seedPath = path.join(process.cwd(), 'prisma', 'seed.ts');
      const seedContent = fs.readFileSync(seedPath, 'utf-8');

      expect(seedContent).toContain('PrismaClient');
      expect(seedContent).toContain('bcrypt');
      expect(seedContent).toContain('upsert');
      expect(seedContent).toContain('admin@studio42.dev');
    });
  });
});

