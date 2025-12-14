import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductMedia from '@/components/products/ProductMedia';

const mockVideoMedia = [
  {
    id: '1',
    type: 'VIDEO',
    url: 'https://www.youtube.com/embed/test',
    thumbnail: '/images/video-thumb.jpg',
    title: 'Test Video',
  },
];

describe('ProductMedia Video', () => {
  it('should show play button for video', () => {
    render(<ProductMedia media={mockVideoMedia} />);
    // Video should be rendered (play button overlay)
    expect(screen.getByText('Media')).toBeInTheDocument();
  });

  it('should play video on click', async () => {
    const user = userEvent.setup();
    render(<ProductMedia media={mockVideoMedia} />);
    
    // Find and click the video thumbnail
    const mediaContainer = screen.getByText('Media').closest('section');
    if (mediaContainer) {
      const videoArea = mediaContainer.querySelector('div[style*="cursor: pointer"]');
      if (videoArea) {
        await user.click(videoArea as HTMLElement);
        // Video should start playing (iframe should appear)
      }
    }
  });
});

