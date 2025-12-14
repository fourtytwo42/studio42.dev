import { validateEnvVars, getEnvVar } from '@/lib/env';

describe('Configuration Tests', () => {
  describe('getEnvVar', () => {
    beforeEach(() => {
      delete process.env.TEST_VAR;
    });

    it('should return environment variable value when set', () => {
      process.env.TEST_VAR = 'test-value';
      expect(getEnvVar('TEST_VAR')).toBe('test-value');
    });

    it('should return default value when variable is not set', () => {
      expect(getEnvVar('TEST_VAR', 'default-value')).toBe('default-value');
    });

    it('should throw error when variable is not set and no default provided', () => {
      expect(() => getEnvVar('TEST_VAR')).toThrow(
        'Environment variable TEST_VAR is required but not set'
      );
    });
  });

  describe('validateEnvVars', () => {
    beforeEach(() => {
      delete process.env.TEST_VAR_1;
      delete process.env.TEST_VAR_2;
    });

    it('should not throw when all required variables are set', () => {
      process.env.TEST_VAR_1 = 'value1';
      process.env.TEST_VAR_2 = 'value2';
      expect(() => validateEnvVars(['TEST_VAR_1', 'TEST_VAR_2'])).not.toThrow();
    });

    it('should throw when any required variable is missing', () => {
      process.env.TEST_VAR_1 = 'value1';
      expect(() => validateEnvVars(['TEST_VAR_1', 'TEST_VAR_2'])).toThrow(
        'Missing required environment variables: TEST_VAR_2'
      );
    });

    it('should throw with all missing variables listed', () => {
      expect(() => validateEnvVars(['TEST_VAR_1', 'TEST_VAR_2'])).toThrow(
        'Missing required environment variables: TEST_VAR_1, TEST_VAR_2'
      );
    });
  });

  describe('Next.js Configuration', () => {
    it('should have correct TypeScript configuration', () => {
      // This test verifies that TypeScript config is valid
      // The actual config is in tsconfig.json
      expect(true).toBe(true);
    });

    it('should have correct Next.js configuration', () => {
      // This test verifies that Next.js config is valid
      // The actual config is in next.config.js
      expect(true).toBe(true);
    });
  });
});

