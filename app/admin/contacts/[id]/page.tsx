'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ContactDetails from '@/components/admin/ContactDetails';
import { Contact } from '@prisma/client';

export default function ContactDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(`/api/admin/contacts/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch contact');
        }

        const data = await response.json();
        setContact(data.contact);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchContact();
    }
  }, [params.id]);

  const handleMarkRead = async (read: boolean) => {
    if (!contact) return;

    try {
      const response = await fetch(`/api/admin/contacts/${contact.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read }),
      });

      if (!response.ok) {
        throw new Error('Failed to update contact');
      }

      setContact({ ...contact, read });
    } catch (err) {
      console.error('Error updating contact:', err);
    }
  };

  const handleMarkResponded = async (responded: boolean) => {
    if (!contact) return;

    try {
      const response = await fetch(`/api/admin/contacts/${contact.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responded }),
      });

      if (!response.ok) {
        throw new Error('Failed to update contact');
      }

      setContact({ ...contact, responded });
    } catch (err) {
      console.error('Error updating contact:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-5xl)' }}>
        Loading contact details...
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-5xl)' }}>
        <p style={{ color: 'var(--color-error)', marginBottom: 'var(--spacing-lg)' }}>
          {error || 'Contact not found'}
        </p>
        <Link
          href="/admin/contacts"
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
          }}
        >
          Back to Contacts
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <Link
          href="/admin/contacts"
          style={{
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          ← Back to Contacts
        </Link>
      </div>

      <ContactDetails
        contact={contact}
        onMarkRead={handleMarkRead}
        onMarkResponded={handleMarkResponded}
      />
    </div>
  );
}

