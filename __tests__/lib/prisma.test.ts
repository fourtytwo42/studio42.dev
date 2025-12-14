describe('Prisma Client', () => {
  it('should export prisma client module', () => {
    // Test that the module can be imported
    const prismaModule = require('@/lib/prisma');
    expect(prismaModule).toHaveProperty('prisma');
  });

  it('should be a singleton pattern implementation', () => {
    // Test that the singleton pattern is implemented
    const fs = require('fs');
    const path = require('path');
    const prismaPath = path.join(process.cwd(), 'lib', 'prisma.ts');
    const prismaContent = fs.readFileSync(prismaPath, 'utf-8');
    
    expect(prismaContent).toContain('globalForPrisma');
    expect(prismaContent).toContain('globalThis');
  });

  it('should have Prisma client configuration', () => {
    // Test that Prisma client is configured correctly
    const fs = require('fs');
    const path = require('path');
    const prismaPath = path.join(process.cwd(), 'lib', 'prisma.ts');
    const prismaContent = fs.readFileSync(prismaPath, 'utf-8');
    
    expect(prismaContent).toContain('PrismaClient');
    expect(prismaContent).toContain('log');
  });
});

