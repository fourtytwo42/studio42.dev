/**
 * Environment variable validation and access
 */

export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || defaultValue || '';
}

export function validateEnvVars(requiredVars: string[]): void {
  const missing: string[] = [];
  
  for (const key of requiredVars) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
}

// Lazy-loaded environment variables to avoid errors during test setup
export const env = {
  get databaseUrl() {
    return process.env.DATABASE_URL || '';
  },
  get nextPublicAppUrl() {
    return getEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000');
  },
  get nodeEnv() {
    return getEnvVar('NODE_ENV', 'development');
  },
  get groqApiKey() {
    return process.env.GROQ_API_KEY || '';
  },
  get openaiApiKey() {
    return process.env.OPENAI_API_KEY || '';
  },
  get nextAuthSecret() {
    return process.env.NEXTAUTH_SECRET || '';
  },
  get nextAuthUrl() {
    return getEnvVar('NEXTAUTH_URL', 'http://localhost:3000');
  },
  get smtpHost() {
    return process.env.SMTP_HOST || '';
  },
  get smtpPort() {
    return process.env.SMTP_PORT || '';
  },
  get smtpUser() {
    return process.env.SMTP_USER || '';
  },
  get smtpPassword() {
    return process.env.SMTP_PASSWORD || '';
  },
  get smtpFromEmail() {
    return process.env.SMTP_FROM_EMAIL || '';
  },
  get smtpFromName() {
    return getEnvVar('SMTP_FROM_NAME', 'Studio42');
  },
};

