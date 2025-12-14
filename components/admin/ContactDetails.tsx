'use client';

import { Contact, InquiryType, ContactMethod } from '@prisma/client';

interface ContactDetailsProps {
  contact: Contact;
  onMarkRead: (read: boolean) => Promise<void>;
  onMarkResponded: (responded: boolean) => Promise<void>;
}

export default function ContactDetails({
  contact,
  onMarkRead,
  onMarkResponded,
}: ContactDetailsProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInquiryTypeLabel = (type: InquiryType) => {
    const labels: Partial<Record<InquiryType, string>> = {
      GENERAL_INQUIRY: 'General Inquiry',
      REQUEST_DEMO: 'Request Demo',
      CONTACT_SALES: 'Contact Sales',
      TECHNICAL_SUPPORT: 'Technical Support',
      OTHER: 'Other',
    };
    return labels[type] || type;
  };

  const getContactMethodLabel = (method: ContactMethod) => {
    const labels: Record<ContactMethod, string> = {
      EMAIL: 'Email',
      PHONE: 'Phone',
      EITHER: 'Either',
    };
    return labels[method] || method;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          paddingBottom: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--color-background-tertiary)',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            {contact.name}
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {formatDate(contact.createdAt)}
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 'var(--spacing-sm)',
          }}
        >
          {!contact.read && (
            <button
              onClick={() => onMarkRead(true)}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              Mark as Read
            </button>
          )}
          {!contact.responded && (
            <button
              onClick={() => onMarkResponded(true)}
              style={{
                padding: 'var(--spacing-sm) var(--spacing-md)',
                backgroundColor: 'var(--color-status-available-bg)',
                color: 'var(--color-status-available)',
                border: '1px solid var(--color-status-available)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              Mark as Responded
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-lg)',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            Contact Information
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Email:
              </span>{' '}
              <a
                href={`mailto:${contact.email}`}
                style={{
                  color: 'var(--color-primary)',
                  textDecoration: 'none',
                }}
              >
                {contact.email}
              </a>
            </div>
            {contact.phone && (
              <div>
                <span
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Phone:
                </span>{' '}
                <a
                  href={`tel:${contact.phone}`}
                  style={{
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                  }}
                >
                  {contact.phone}
                </a>
              </div>
            )}
            {contact.company && (
              <div>
                <span
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Company:
                </span>{' '}
                <span style={{ color: 'var(--color-text-primary)' }}>{contact.company}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            Inquiry Details
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Type:
              </span>{' '}
              <span style={{ color: 'var(--color-text-primary)' }}>
                {getInquiryTypeLabel(contact.inquiryType)}
              </span>
            </div>
            {contact.product && (
              <div>
                <span
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Product:
                </span>{' '}
                <span style={{ color: 'var(--color-text-primary)' }}>{contact.product}</span>
              </div>
            )}
            <div>
              <span
                style={{
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Preferred Method:
              </span>{' '}
              <span style={{ color: 'var(--color-text-primary)' }}>
                {getContactMethodLabel(contact.preferredMethod)}
              </span>
            </div>
            {contact.source && (
              <div>
                <span
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Source:
                </span>{' '}
                <span style={{ color: 'var(--color-text-primary)' }}>{contact.source}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2
          style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          Message
        </h2>
        <div
          style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--color-background-secondary)',
            borderRadius: 'var(--radius-md)',
            whiteSpace: 'pre-wrap',
            lineHeight: 'var(--line-height-relaxed)',
            color: 'var(--color-text-primary)',
          }}
        >
          {contact.message}
        </div>
      </div>
    </div>
  );
}

