import { checkRateLimit, getRateLimitInfo } from '@/lib/rate-limit';

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear rate limit store by re-importing
    jest.resetModules();
  });

  describe('checkRateLimit', () => {
    it('should allow first request', async () => {
      const { checkRateLimit } = await import('@/lib/rate-limit');
      const result = await checkRateLimit('test-id', 10, 60000);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9);
      expect(result.resetAt).toBeInstanceOf(Date);
    });

    it('should allow multiple requests within limit', async () => {
      const { checkRateLimit } = await import('@/lib/rate-limit');
      const identifier = 'test-id-2';

      for (let i = 0; i < 5; i++) {
        const result = await checkRateLimit(identifier, 10, 60000);
        expect(result.allowed).toBe(true);
      }

      const finalResult = await checkRateLimit(identifier, 10, 60000);
      expect(finalResult.remaining).toBeLessThan(10);
    });

    it('should block requests exceeding limit', async () => {
      const { checkRateLimit } = await import('@/lib/rate-limit');
      const identifier = 'test-id-3';

      // Make max requests
      for (let i = 0; i < 10; i++) {
        await checkRateLimit(identifier, 10, 60000);
      }

      // Next request should be blocked
      const result = await checkRateLimit(identifier, 10, 60000);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset after window expires', async () => {
      const { checkRateLimit } = await import('@/lib/rate-limit');
      const identifier = 'test-id-4';

      // Fill up the limit
      for (let i = 0; i < 10; i++) {
        await checkRateLimit(identifier, 10, 100); // 100ms window
      }

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Should be allowed again
      const result = await checkRateLimit(identifier, 10, 100);
      expect(result.allowed).toBe(true);
    });
  });

  describe('getRateLimitInfo', () => {
    it('should return rate limit info without incrementing', async () => {
      const { getRateLimitInfo, checkRateLimit } = await import('@/lib/rate-limit');
      const identifier = 'test-id-5';

      // Make some requests
      await checkRateLimit(identifier, 10, 60000);
      await checkRateLimit(identifier, 10, 60000);

      const info = getRateLimitInfo(identifier, 10, 60000);
      expect(info.remaining).toBeLessThan(10);
      expect(info.resetAt).toBeInstanceOf(Date);
    });
  });
});

