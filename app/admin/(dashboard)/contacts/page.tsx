'use client';

import { useState, useEffect } from 'react';
import ContactFilters from '@/components/admin/ContactFilters';
import ContactsTable from '@/components/admin/ContactsTable';
import Pagination from '@/components/admin/Pagination';
import { Contact } from '@prisma/client';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    inquiryType: '',
    read: '',
    responded: '',
  });

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...filters,
      });

      const response = await fetch(`/api/admin/contacts?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const data = await response.json();
      setContacts(data.contacts);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [page, filters]);

  const handleMarkRead = async (id: string, read: boolean) => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read }),
      });

      if (!response.ok) {
        throw new Error('Failed to update contact');
      }

      await fetchContacts();
    } catch (err) {
      console.error('Error updating contact:', err);
    }
  };

  const handleMarkResponded = async (id: string, responded: boolean) => {
    try {
      const response = await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responded }),
      });

      if (!response.ok) {
        throw new Error('Failed to update contact');
      }

      await fetchContacts();
    } catch (err) {
      console.error('Error updating contact:', err);
    }
  };

  if (loading && contacts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-5xl)' }}>
        Loading contacts...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-5xl)', color: 'var(--color-error)' }}>
        {error}
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <h1
          style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
          }}
        >
          Contacts
        </h1>
      </div>

      <ContactFilters onFilterChange={setFilters} />

      <ContactsTable
        contacts={contacts}
        onMarkRead={handleMarkRead}
        onMarkResponded={handleMarkResponded}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}

