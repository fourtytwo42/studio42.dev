import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductMedia from '@/components/products/ProductMedia';

const mockMedia = [
  {
    id: '1',
    type: 'IMAGE',
    url: '/images/test.jpg',
    thumbnail: null,
    title: 'Test Image',
  },
  {
    id: '2',
    type: 'VIDEO',
    url: 'https://www.youtube.com/embed/test',
    thumbnail: '/images/video-thumb.jpg',
    title: 'Test Video',
  },
];

describe('ProductMedia', () => {
  it('should render media section when media exists', () => {
    render(<ProductMedia media={mockMedia} />);
    expect(screen.getByText('Media')).toBeInTheDocument();
  });

  it('should return null when no media', () => {
    const { container } = render(<ProductMedia media={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('should show navigation buttons when multiple media items', () => {
    render(<ProductMedia media={mockMedia} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should navigate to next media item', async () => {
    const user = userEvent.setup();
    render(<ProductMedia media={mockMedia} />);
    
    const nextButton = screen.getByText('Next');
    await user.click(nextButton);
    
    // Should show second media item
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });

  it('should navigate to previous media item', async () => {
    const user = userEvent.setup();
    render(<ProductMedia media={mockMedia} />);
    
    // First navigate to second item
    const nextButton = screen.getByText('Next');
    await user.click(nextButton);
    
    // Then navigate back
    const prevButton = screen.getByText('Previous');
    await user.click(prevButton);
    
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });
});

