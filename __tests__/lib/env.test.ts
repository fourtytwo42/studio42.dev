import { getEnvVar, validateEnvVars, env } from '@/lib/env';

describe('Environment Variables', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getEnvVar', () => {
    it('should return environment variable value when set', () => {
      process.env.TEST_VAR = 'test-value';
      expect(getEnvVar('TEST_VAR')).toBe('test-value');
    });

    it('should return default value when variable is not set', () => {
      delete process.env.TEST_VAR;
      expect(getEnvVar('TEST_VAR', 'default-value')).toBe('default-value');
    });

    it('should throw error when variable is not set and no default provided', () => {
      delete process.env.TEST_VAR;
      expect(() => getEnvVar('TEST_VAR')).toThrow(
        'Environment variable TEST_VAR is required but not set'
      );
    });
  });

  describe('validateEnvVars', () => {
    it('should not throw when all required variables are set', () => {
      process.env.TEST_VAR_1 = 'value1';
      process.env.TEST_VAR_2 = 'value2';
      expect(() => validateEnvVars(['TEST_VAR_1', 'TEST_VAR_2'])).not.toThrow();
    });

    it('should throw when any required variable is missing', () => {
      process.env.TEST_VAR_1 = 'value1';
      delete process.env.TEST_VAR_2;
      expect(() => validateEnvVars(['TEST_VAR_1', 'TEST_VAR_2'])).toThrow(
        'Missing required environment variables: TEST_VAR_2'
      );
    });

    it('should throw with all missing variables listed', () => {
      delete process.env.TEST_VAR_1;
      delete process.env.TEST_VAR_2;
      expect(() => validateEnvVars(['TEST_VAR_1', 'TEST_VAR_2'])).toThrow(
        'Missing required environment variables: TEST_VAR_1, TEST_VAR_2'
      );
    });
  });

  describe('env object', () => {
    it('should access databaseUrl with default', () => {
      delete process.env.DATABASE_URL;
      expect(env.databaseUrl).toBe('');
    });

    it('should access nextPublicAppUrl with default', () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      expect(env.nextPublicAppUrl).toBe('http://localhost:3000');
    });

    it('should access nodeEnv with default', () => {
      delete process.env.NODE_ENV;
      expect(env.nodeEnv).toBe('development');
    });

    it('should access groqApiKey with default', () => {
      delete process.env.GROQ_API_KEY;
      expect(env.groqApiKey).toBe('');
    });

    it('should access openaiApiKey with default', () => {
      delete process.env.OPENAI_API_KEY;
      expect(env.openaiApiKey).toBe('');
    });

    it('should access nextAuthSecret with default', () => {
      delete process.env.NEXTAUTH_SECRET;
      expect(env.nextAuthSecret).toBe('');
    });

    it('should access nextAuthUrl with default', () => {
      delete process.env.NEXTAUTH_URL;
      expect(env.nextAuthUrl).toBe('http://localhost:3000');
    });

    it('should access smtpHost with default', () => {
      delete process.env.SMTP_HOST;
      expect(env.smtpHost).toBe('');
    });

    it('should access smtpPort with default', () => {
      delete process.env.SMTP_PORT;
      expect(env.smtpPort).toBe('');
    });

    it('should access smtpUser with default', () => {
      delete process.env.SMTP_USER;
      expect(env.smtpUser).toBe('');
    });

    it('should access smtpPassword with default', () => {
      delete process.env.SMTP_PASSWORD;
      expect(env.smtpPassword).toBe('');
    });

    it('should access smtpFromEmail with default', () => {
      delete process.env.SMTP_FROM_EMAIL;
      expect(env.smtpFromEmail).toBe('');
    });

    it('should access smtpFromName with default', () => {
      delete process.env.SMTP_FROM_NAME;
      expect(env.smtpFromName).toBe('Studio42');
    });

    it('should access environment variables when set', () => {
      process.env.DATABASE_URL = 'postgresql://test';
      process.env.GROQ_API_KEY = 'test-key';
      expect(env.databaseUrl).toBe('postgresql://test');
      expect(env.groqApiKey).toBe('test-key');
    });
  });
});

