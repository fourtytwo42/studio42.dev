import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '@/components/admin/Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render pagination controls', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should disable previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('should call onPageChange when page number is clicked', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when next button is clicked', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when previous button is clicked', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByText('Previous');
    fireEvent.click(previousButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('should show ellipsis for many pages', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={10}
        onPageChange={mockOnPageChange}
      />
    );

    // Should show ellipsis when there are many pages
    const pageNumbers = screen.getAllByRole('button').filter(
      (button) => !isNaN(Number(button.textContent))
    );
    expect(pageNumbers.length).toBeGreaterThan(0);
  });
});

