module.exports = {
  apps: [
    {
      name: 'studio42-website',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/home/hendo420/studio42.dev',
      instances: 1,
      exec_mode: 'fork',
      env_file: '.env',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_URL: 'postgresql://studio42_user:znepUX6LUlku9XkTSjhotxHKh@localhost:5432/studio42_website',
        NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
        NEXTAUTH_SECRET: 'qVzK4Ac5ppVT2kCf0s1DeJF57RRshz52PwhZnrCLbIE',
        NEXTAUTH_URL: 'http://localhost:3000',
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
    },
  ],
};
