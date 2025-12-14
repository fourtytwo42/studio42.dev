'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  totalContacts: number;
  unreadContacts: number;
  respondedContacts: number;
  contactsByType: Record<string, number>;
  recentContacts: Array<{
    id: string;
    name: string;
    email: string;
    inquiryType: string;
    createdAt: Date;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-5xl)' }}>
        Loading dashboard...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-5xl)', color: 'var(--color-error)' }}>
        {error || 'Failed to load statistics'}
      </div>
    );
  }

  return (
    <div>
      <h1
        style={{
          fontSize: 'var(--font-size-3xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        Dashboard
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)',
        }}
      >
        <div
          style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--color-background)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h3
            style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            Total Contacts
          </h3>
          <p
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
            }}
          >
            {stats.totalContacts}
          </p>
        </div>

        <div
          style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--color-background)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h3
            style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            Unread
          </h3>
          <p
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-primary)',
            }}
          >
            {stats.unreadContacts}
          </p>
        </div>

        <div
          style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--color-background)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h3
            style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--spacing-sm)',
            }}
          >
            Responded
          </h3>
          <p
            style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-status-available)',
            }}
          >
            {stats.respondedContacts}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: 'var(--spacing-lg)',
        }}
      >
        <div
          style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--color-background)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <h2
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            Contacts by Type
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)',
            }}
          >
            {Object.entries(stats.contactsByType).map(([type, count]) => (
              <div
                key={type}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: 'var(--spacing-sm)',
                  backgroundColor: 'var(--color-background-secondary)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <span style={{ color: 'var(--color-text-primary)' }}>{type}</span>
                <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-primary)' }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--color-background)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            <h2
              style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
              }}
            >
              Recent Contacts
            </h2>
            <Link
              href="/admin/contacts"
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-primary)',
                textDecoration: 'none',
              }}
            >
              View All
            </Link>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-sm)',
            }}
          >
            {stats.recentContacts.map((contact) => (
              <Link
                key={contact.id}
                href={`/admin/contacts/${contact.id}`}
                style={{
                  padding: 'var(--spacing-sm)',
                  backgroundColor: 'var(--color-background-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none',
                  color: 'var(--color-text-primary)',
                }}
              >
                <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{contact.name}</div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  {contact.email}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
