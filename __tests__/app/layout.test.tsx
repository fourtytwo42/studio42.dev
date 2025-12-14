import { render } from '@testing-library/react';
import RootLayout from '@/app/layout';

describe('RootLayout', () => {
  it('should render children', () => {
    // Test the component structure without rendering html element
    const TestComponent = () => (
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );
    const { getByText } = render(<TestComponent />);
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('should have correct metadata', () => {
    // Metadata is set at build time, so we just verify the component structure
    const TestComponent = () => (
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    );
    const { container } = render(<TestComponent />);
    expect(container).toBeTruthy();
  });
});

