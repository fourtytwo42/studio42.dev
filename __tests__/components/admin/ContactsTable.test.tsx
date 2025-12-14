import { render, screen } from '@testing-library/react';
import ContactsTable from '@/components/admin/ContactsTable';
import { Contact, InquiryType } from '@prisma/client';

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    company: 'Test Co',
    phone: null,
    product: 'test-product',
    inquiryType: 'GENERAL_INQUIRY' as InquiryType,
    message: 'Test message',
    preferredMethod: 'EMAIL',
    source: null,
    read: false,
    responded: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Another User',
    email: 'another@test.com',
    company: null,
    phone: null,
    product: null,
    inquiryType: 'REQUEST_DEMO' as InquiryType,
    message: 'Another message',
    preferredMethod: 'EMAIL',
    source: null,
    read: true,
    responded: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

describe('ContactsTable', () => {
  const mockOnMarkRead = jest.fn();
  const mockOnMarkResponded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render contacts table', () => {
    render(
      <ContactsTable
        contacts={mockContacts}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Another User')).toBeInTheDocument();
    expect(screen.getByText('test@test.com')).toBeInTheDocument();
    expect(screen.getByText('another@test.com')).toBeInTheDocument();
  });

  it('should display empty state when no contacts', () => {
    render(
      <ContactsTable
        contacts={[]}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    expect(screen.getByText(/no contacts found/i)).toBeInTheDocument();
  });

  it('should display status badges correctly', () => {
    render(
      <ContactsTable
        contacts={mockContacts}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    expect(screen.getByText('New')).toBeInTheDocument();
    expect(screen.getByText('Responded')).toBeInTheDocument();
  });

  it('should call onMarkRead when mark read button is clicked', () => {
    render(
      <ContactsTable
        contacts={mockContacts}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    const markReadButton = screen.getByText('Mark Read');
    markReadButton.click();

    expect(mockOnMarkRead).toHaveBeenCalledWith('1', true);
  });

  it('should call onMarkResponded when mark responded button is clicked', () => {
    render(
      <ContactsTable
        contacts={mockContacts}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    const markRespondedButton = screen.getByText('Mark Responded');
    markRespondedButton.click();

    expect(mockOnMarkResponded).toHaveBeenCalledWith('1', true);
  });

  it('should not show mark read button for read contacts', () => {
    render(
      <ContactsTable
        contacts={[mockContacts[1]]}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    expect(screen.queryByText('Mark Read')).not.toBeInTheDocument();
  });

  it('should not show mark responded button for responded contacts', () => {
    render(
      <ContactsTable
        contacts={[mockContacts[1]]}
        onMarkRead={mockOnMarkRead}
        onMarkResponded={mockOnMarkResponded}
      />
    );

    expect(screen.queryByText('Mark Responded')).not.toBeInTheDocument();
  });
});

