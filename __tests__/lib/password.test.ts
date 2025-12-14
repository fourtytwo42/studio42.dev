import { hashPassword, verifyPassword, validatePasswordStrength } from '@/lib/password';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    it('should hash password with bcrypt', async () => {
      const mockHash = 'hashed_password_123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

      const result = await hashPassword('testpassword');
      expect(result).toBe(mockHash);
      expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', 10);
    });

    it('should use correct salt rounds', async () => {
      const mockHash = 'hashed';
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

      await hashPassword('password');
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await verifyPassword('password', 'hash');
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hash');
    });

    it('should reject incorrect password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await verifyPassword('wrong', 'hash');
      expect(result).toBe(false);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should accept strong password', () => {
      const result = validatePasswordStrength('StrongPass123');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password shorter than 8 characters', () => {
      const result = validatePasswordStrength('Short1');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without uppercase', () => {
      const result = validatePasswordStrength('lowercase123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase', () => {
      const result = validatePasswordStrength('UPPERCASE123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without number', () => {
      const result = validatePasswordStrength('NoNumber');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should return all errors for weak password', () => {
      const result = validatePasswordStrength('weak');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});

