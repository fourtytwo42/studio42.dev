'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Contact, InquiryType } from '@prisma/client';

interface ContactsTableProps {
  contacts: Contact[];
  onMarkRead: (id: string, read: boolean) => Promise<void>;
  onMarkResponded: (id: string, responded: boolean) => Promise<void>;
}

export default function ContactsTable({
  contacts,
  onMarkRead,
  onMarkResponded,
}: ContactsTableProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  if (contacts.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--spacing-5xl)',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
        }}
      >
        No contacts found.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--color-background)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: 'var(--color-background-secondary)',
                borderBottom: '1px solid var(--color-background-tertiary)',
              }}
            >
              <th
                style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'left',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Name
              </th>
              <th
                style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'left',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Email
              </th>
              <th
                style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'left',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Company
              </th>
              <th
                style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'left',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Product
              </th>
              <th
                style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'left',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Type
              </th>
              <th
                style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'left',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Date
              </th>
              <th
                style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'left',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Status
              </th>
              <th
                style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'center',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                style={{
                  borderBottom: '1px solid var(--color-background-tertiary)',
                  backgroundColor: contact.read ? 'var(--color-background)' : 'var(--color-background-secondary)',
                }}
              >
                <td
                  style={{
                    padding: 'var(--spacing-md)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: contact.read ? 'var(--font-weight-normal)' : 'var(--font-weight-medium)',
                  }}
                >
                  <Link
                    href={`/admin/contacts/${contact.id}`}
                    style={{
                      color: 'var(--color-primary)',
                      textDecoration: 'none',
                      display: 'block',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = 'underline';
                      e.currentTarget.style.opacity = '0.8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = 'none';
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    {contact.name}
                  </Link>
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-md)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  <a
                    href={`mailto:${contact.email}`}
                    style={{
                      color: 'var(--color-primary)',
                      textDecoration: 'none',
                      display: 'block',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = 'underline';
                      e.currentTarget.style.opacity = '0.8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = 'none';
                      e.currentTarget.style.opacity = '1';
                    }}
                  >
                    {contact.email}
                  </a>
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-md)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {contact.company || '—'}
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-md)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {contact.product || '—'}
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-md)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {getInquiryTypeLabel(contact.inquiryType)}
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-md)',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {formatDate(contact.createdAt)}
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-md)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-xs)',
                      flexWrap: 'wrap',
                    }}
                  >
                    {!contact.read && (
                      <span
                        style={{
                          padding: '2px 8px',
                          backgroundColor: 'var(--color-primary)',
                          color: 'white',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--font-size-xs)',
                        }}
                      >
                        New
                      </span>
                    )}
                    {contact.responded && (
                      <span
                        style={{
                          padding: '2px 8px',
                          backgroundColor: 'var(--color-status-available-bg)',
                          color: 'var(--color-status-available)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--font-size-xs)',
                        }}
                      >
                        Responded
                      </span>
                    )}
                  </div>
                </td>
                <td
                  style={{
                    padding: 'var(--spacing-md)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--spacing-xs)',
                      justifyContent: 'center',
                    }}
                  >
                    {!contact.read && (
                      <button
                        onClick={() => onMarkRead(contact.id, true)}
                        style={{
                          padding: '4px 8px',
                          fontSize: 'var(--font-size-xs)',
                          backgroundColor: 'var(--color-primary)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                        }}
                      >
                        Mark Read
                      </button>
                    )}
                    {!contact.responded && (
                      <button
                        onClick={() => onMarkResponded(contact.id, true)}
                        style={{
                          padding: '4px 8px',
                          fontSize: 'var(--font-size-xs)',
                          backgroundColor: 'var(--color-status-available-bg)',
                          color: 'var(--color-status-available)',
                          border: '1px solid var(--color-status-available)',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                        }}
                      >
                        Mark Responded
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

