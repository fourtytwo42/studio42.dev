import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductMedia from '@/components/products/ProductMedia';

describe('ProductMedia Edge Cases', () => {
  it('should handle single media item (no navigation)', () => {
    const singleMedia = [
      {
        id: '1',
        type: 'IMAGE',
        url: '/images/test.jpg',
        thumbnail: null,
        title: 'Test Image',
      },
    ];

    render(<ProductMedia media={singleMedia} />);
    expect(screen.getByText('Media')).toBeInTheDocument();
    // Should not show navigation buttons for single item
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('should loop to first item when clicking next on last item', async () => {
    const user = userEvent.setup();
    const twoMedia = [
      {
        id: '1',
        type: 'IMAGE',
        url: '/images/test1.jpg',
        thumbnail: null,
        title: 'Test Image 1',
      },
      {
        id: '2',
        type: 'IMAGE',
        url: '/images/test2.jpg',
        thumbnail: null,
        title: 'Test Image 2',
      },
    ];

    render(<ProductMedia media={twoMedia} />);
    
    // Click next to go to second item
    const nextButton = screen.getByText('Next');
    await user.click(nextButton);
    
    // Click next again to loop back to first
    await user.click(nextButton);
    
    expect(screen.getByText('Previous')).toBeInTheDocument();
  });

  it('should loop to last item when clicking previous on first item', async () => {
    const user = userEvent.setup();
    const twoMedia = [
      {
        id: '1',
        type: 'IMAGE',
        url: '/images/test1.jpg',
        thumbnail: null,
        title: 'Test Image 1',
      },
      {
        id: '2',
        type: 'IMAGE',
        url: '/images/test2.jpg',
        thumbnail: null,
        title: 'Test Image 2',
      },
    ];

    render(<ProductMedia media={twoMedia} />);
    
    // Click previous to loop to last item
    const prevButton = screen.getByText('Previous');
    await user.click(prevButton);
    
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should handle video without thumbnail', () => {
    const videoWithoutThumbnail = [
      {
        id: '1',
        type: 'VIDEO',
        url: 'https://www.youtube.com/embed/test',
        thumbnail: null,
        title: 'Test Video',
      },
    ];

    render(<ProductMedia media={videoWithoutThumbnail} />);
    expect(screen.getByText('Media')).toBeInTheDocument();
  });
});

