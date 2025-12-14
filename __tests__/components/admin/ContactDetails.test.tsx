import { render, screen, fireEvent } from '@testing-library/react';
import ContactDetails from '@/components/admin/ContactDetails';
import { Contact, InquiryType, ContactMethod } from '@prisma/client';

const mockContact: Contact = {
  id: '1',
  name: 'Test User',
  email: 'test@test.com',
  company: 'Test Co',
  phone: '+1234567890',
  product: 'test-product',
  inquiryType: 'GENERAL_INQUIRY' as InquiryType,
  message: 'This is a test message',
  preferredMethod: 'EMAIL' as ContactMethod,
  source: 'test-source',
  read: false,
  responded: false,
  createdAt: new Date('2024-01-01T10:00:00Z'),
  updatedAt: new Date('2024-01-01T10:00:00Z'),
};

describe('ContactDetails', () => {
  const mockOnMarkRead = jest.fn();
  const mockOnMarkResponded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render contact details', () => {
    render(
      <ContactDetails
        contact={mockContact}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@test.com')).toBeInTheDocument();
    expect(screen.getByText('Test Co')).toBeInTheDocument();
    expect(screen.getByText('+1234567890')).toBeInTheDocument();
    expect(screen.getByText('test-product')).toBeInTheDocument();
    expect(screen.getByText('This is a test message')).toBeInTheDocument();
  });

  it('should display inquiry type label correctly', () => {
    render(
      <ContactDetails
        contact={mockContact}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    expect(screen.getByText('General Inquiry')).toBeInTheDocument();
  });

  it('should display contact method label correctly', () => {
    render(
      <ContactDetails
        contact={mockContact}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('should call onMarkRead when mark as read button is clicked', () => {
    render(
      <ContactDetails
        contact={mockContact}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    const markReadButton = screen.getByText('Mark as Read');
    fireEvent.click(markReadButton);

    expect(mockOnMarkRead).toHaveBeenCalledWith(true);
  });

  it('should call onMarkResponded when mark as responded button is clicked', () => {
    render(
      <ContactDetails
        contact={mockContact}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    const markRespondedButton = screen.getByText('Mark as Responded');
    fireEvent.click(markRespondedButton);

    expect(mockOnMarkResponded).toHaveBeenCalledWith(true);
  });

  it('should not show mark as read button for read contacts', () => {
    const readContact = { ...mockContact, read: true };
    render(
      <ContactDetails
        contact={readContact}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    expect(screen.queryByText('Mark as Read')).not.toBeInTheDocument();
  });

  it('should not show mark as responded button for responded contacts', () => {
    const respondedContact = { ...mockContact, responded: true };
    render(
      <ContactDetails
        contact={respondedContact}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    expect(screen.queryByText('Mark as Responded')).not.toBeInTheDocument();
  });

  it('should handle missing optional fields', () => {
    const contactWithoutOptional = {
      ...mockContact,
      company: null,
      phone: null,
      product: null,
      source: null,
    };

    render(
      <ContactDetails
        contact={contactWithoutOptional}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@test.com')).toBeInTheDocument();
  });

  it('should format date correctly', () => {
    render(
      <ContactDetails
        contact={mockContact}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    // Date should be formatted and displayed
    const dateElement = screen.getByText(/January/i);
    expect(dateElement).toBeInTheDocument();
  });
});

