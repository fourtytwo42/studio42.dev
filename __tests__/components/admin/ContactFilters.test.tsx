import { render, screen, fireEvent } from '@testing-library/react';
import ContactFilters from '@/components/admin/ContactFilters';

describe('ContactFilters', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all filter inputs', () => {
    render(<ContactFilters onFilterChange={mockOnFilterChange} />);

    expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/inquiry type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/read status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/response status/i)).toBeInTheDocument();
    expect(screen.getByText(/clear filters/i)).toBeInTheDocument();
  });

  it('should call onFilterChange when search changes', () => {
    render(<ContactFilters onFilterChange={mockOnFilterChange} />);

    const searchInput = screen.getByLabelText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: 'test',
      inquiryType: '',
      read: '',
      responded: '',
    });
  });

  it('should call onFilterChange when inquiry type changes', () => {
    render(<ContactFilters onFilterChange={mockOnFilterChange} />);

    const inquiryTypeSelect = screen.getByLabelText(/inquiry type/i);
    fireEvent.change(inquiryTypeSelect, { target: { value: 'GENERAL_INQUIRY' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: '',
      inquiryType: 'GENERAL_INQUIRY',
      read: '',
      responded: '',
    });
  });

  it('should call onFilterChange when read status changes', () => {
    render(<ContactFilters onFilterChange={mockOnFilterChange} />);

    const readSelect = screen.getByLabelText(/read status/i);
    fireEvent.change(readSelect, { target: { value: 'false' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: '',
      inquiryType: '',
      read: 'false',
      responded: '',
    });
  });

  it('should call onFilterChange when responded status changes', () => {
    render(<ContactFilters onFilterChange={mockOnFilterChange} />);

    const respondedSelect = screen.getByLabelText(/response status/i);
    fireEvent.change(respondedSelect, { target: { value: 'true' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      search: '',
      inquiryType: '',
      read: '',
      responded: 'true',
    });
  });

  it('should clear all filters when clear button is clicked', () => {
    render(<ContactFilters onFilterChange={mockOnFilterChange} />);

    const searchInput = screen.getByLabelText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'test' } });

    const clearButton = screen.getByText(/clear filters/i);
    fireEvent.click(clearButton);

    expect(mockOnFilterChange).toHaveBeenLastCalledWith({
      search: '',
      inquiryType: '',
      read: '',
      responded: '',
    });
  });
});

