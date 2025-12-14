# Studio 42

Welcome to Studio 42 - A SaaS Studio

## About

Studio 42 is a SaaS studio dedicated to building innovative software solutions. Visit us at [studio42.dev](https://studio42.dev).

## Getting Started

This project is built with Node.js and modern web technologies.

### Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- PostgreSQL
- PM2 (for process management)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/fourtytwo42/studio42.dev.git
cd studio42.dev
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

### Production Deployment

Use PM2 to manage the application in production:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Tech Stack

- Node.js
- PostgreSQL
- PM2

## License

Copyright © Studio 42. All rights reserved.

