# Development Guide

Complete development workflow and guidelines for Studio42.dev main website.

## Overview

This guide provides the development workflow, coding standards, and best practices. All decisions are specified - nothing is left to interpretation.

## Development Workflow

### 1. Follow Implementation Stages

**Always follow the stages in order:**
- See [Implementation Stages](implementation-stages.md) for complete step-by-step guide
- Do not skip stages
- Complete all acceptance criteria before moving to next stage
- Test as you go, don't wait until the end

### 2. Branch Strategy

**Branch Naming:**
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/stage-X-description` - Feature branches (e.g., `feature/stage-5-product-grid`)
- `fix/description` - Bug fixes
- `hotfix/description` - Critical production fixes

**Workflow:**
1. Create feature branch from `develop`
2. Implement feature following stage specifications
3. Write tests
4. Create pull request
5. Code review
6. Merge to `develop`
7. After stage completion, merge `develop` to `main`

### 3. Commit Messages

**Format:**
```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(products): add ProductCard component with hover effects
fix(contact): fix form validation for phone field
docs(api): update API documentation for contacts endpoint
```

### 4. Code Review Process

**Before Submitting PR:**
- [ ] All acceptance criteria met
- [ ] Tests written and passing
- [ ] Code follows style guide
- [ ] No console.logs or debug code
- [ ] Documentation updated if needed

**Review Checklist:**
- Code matches specifications exactly
- No shortcuts or "good enough" implementations
- Error handling implemented
- Accessibility considered
- Performance optimized

## Coding Standards

### TypeScript

**Rules:**
- Always use TypeScript (no `any` types)
- Define interfaces for all data structures
- Use type inference where possible
- Export types from `types/index.ts`

**Example:**
```typescript
// types/index.ts
export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  status: 'AVAILABLE' | 'COMING_SOON' | 'IN_DEVELOPMENT';
  thumbnail: string | null;
  githubUrl: string | null;
  youtubeUrl: string | null;
  demoUrl: string | null;
  pricing: string | null;
  features: Array<{ title: string; description: string }> | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### React Components

**Structure:**
```typescript
// 1. Imports
import { useState } from 'react';
import { Product } from '@/types';
import styles from './Component.module.css';

// 2. Types/Interfaces
interface ComponentProps {
  product: Product;
  onAction?: () => void;
}

// 3. Component
export default function Component({ product, onAction }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState(false);

  // 5. Handlers
  const handleClick = () => {
    setState(true);
    onAction?.();
  };

  // 6. Render
  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  );
}
```

**Rules:**
- Use functional components only
- Use TypeScript for props
- Use CSS Modules for styling
- Extract reusable logic to custom hooks
- Keep components focused (single responsibility)

### CSS Styling

**Rules:**
- Use CSS Modules (`.module.css`)
- Use design tokens (CSS variables) from `styles/design-tokens.css`
- No inline styles
- No Tailwind CSS classes
- Mobile-first responsive design
- Use semantic class names

**Example:**
```css
/* Component.module.css */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

@media (max-width: 640px) {
  .container {
    padding: var(--spacing-md);
  }
  
  .title {
    font-size: var(--font-size-xl);
  }
}
```

### API Routes

**Structure:**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// 1. Validation schema
const requestSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
});

// 2. Handler
export async function POST(request: NextRequest) {
  try {
    // 3. Parse and validate
    const body = await request.json();
    const data = requestSchema.parse(body);

    // 4. Business logic
    const result = await prisma.model.create({ data });

    // 5. Return response
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    // 6. Error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Rules:**
- Always validate input with Zod
- Always handle errors
- Always return proper HTTP status codes
- Use Prisma for database operations
- Add rate limiting where appropriate
- Add caching headers where appropriate

### Error Handling

**Pattern:**
```typescript
try {
  // Operation
} catch (error) {
  // Log error
  console.error('Operation failed:', error);
  
  // Return user-friendly error
  if (error instanceof KnownError) {
    return handleKnownError(error);
  }
  
  // Generic error
  return handleGenericError();
}
```

**Rules:**
- Always use try-catch for async operations
- Log errors with context
- Return user-friendly error messages
- Never expose internal errors to users
- Use error boundaries for React components

### Testing

**Unit Tests:**
- Test utility functions
- Test validation schemas
- Test API route handlers (mocked)
- Target: 90%+ coverage

**Integration Tests:**
- Test API routes with database
- Test form submissions
- Test authentication flows

**E2E Tests (Playwright):**
- Test user journeys
- Test admin workflows
- Test critical paths

**Test Structure:**
```typescript
import { describe, it, expect } from '@jest/globals';
import { functionToTest } from './module';

describe('functionToTest', () => {
  it('should handle valid input', () => {
    const result = functionToTest('valid');
    expect(result).toBe(expected);
  });

  it('should handle invalid input', () => {
    expect(() => functionToTest('invalid')).toThrow();
  });
});
```

## File Organization

### Directory Structure

Follow the exact structure specified in Stage 1 of implementation-stages.md.

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Types: `camelCase.ts` (e.g., `index.ts`)
- Styles: `ComponentName.module.css` (e.g., `ProductCard.module.css`)
- API routes: `route.ts` (in API directory)

**Variables:**
- Components: `PascalCase`
- Functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Types/Interfaces: `PascalCase`

## Performance Guidelines

### Images
- Use Next.js Image component
- Optimize images (WebP format)
- Lazy load below fold
- Use appropriate sizes

### Code Splitting
- Use dynamic imports for heavy components
- Route-based splitting (automatic with Next.js)
- Component lazy loading where appropriate

### Caching
- API routes: Add cache headers
- Static pages: Use ISR (Incremental Static Regeneration)
- Revalidate: 3600 seconds (1 hour) for product data

### Database Queries
- Use Prisma select to limit fields
- Add indexes for frequently queried fields
- Use pagination for large datasets
- Avoid N+1 queries

## Security Guidelines

### Authentication
- Use NextAuth.js for session management
- Hash passwords with bcrypt (10 rounds minimum)
- Protect admin routes
- Rate limit login attempts

### Input Validation
- Always validate on server side
- Use Zod schemas
- Sanitize user inputs
- Prevent SQL injection (Prisma handles this)

### API Security
- Rate limiting on public endpoints
- CORS configuration
- Input validation
- Error messages don't expose internals

### Environment Variables
- Never commit `.env.local`
- Use `.env.example` for documentation
- Validate required variables on startup
- Use strong secrets

## Accessibility

### Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Focus indicators
- Color contrast (4.5:1 minimum)

### Implementation
- Semantic HTML
- ARIA labels where needed
- Alt text on images
- Form labels
- Error announcements

## Documentation

### Code Comments
- Comment complex logic
- Document function parameters and returns
- Explain "why" not "what"
- Keep comments up to date

### README Updates
- Update when adding features
- Document breaking changes
- Include setup instructions
- Add troubleshooting section

## Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Error monitoring setup
- [ ] Performance monitoring setup
- [ ] Backup strategy in place
- [ ] Documentation updated

## Getting Help

If stuck on implementation:

1. Review the relevant feature documentation
2. Check implementation-stages.md for stage details
3. Review code examples in documentation
4. Check existing code for patterns
5. Ask for clarification (don't guess)

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Zod Documentation](https://zod.dev)

