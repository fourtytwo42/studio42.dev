import { render } from '@testing-library/react';
import PublicLayout from '@/app/(public)/layout';

describe('PublicLayout', () => {
  it('should render children', () => {
    const { container } = render(
      <PublicLayout>
        <div>Test Content</div>
      </PublicLayout>
    );
    expect(container.textContent).toContain('Test Content');
  });
});

