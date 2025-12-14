'use client';

import { useState } from 'react';
import { InquiryType } from '@prisma/client';

interface ContactFiltersProps {
  onFilterChange: (filters: {
    search: string;
    inquiryType: string;
    read: string;
    responded: string;
  }) => void;
}

export default function ContactFilters({ onFilterChange }: ContactFiltersProps) {
  const [search, setSearch] = useState('');
  const [inquiryType, setInquiryType] = useState('');
  const [read, setRead] = useState('');
  const [responded, setResponded] = useState('');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, inquiryType, read, responded });
  };

  const handleInquiryTypeChange = (value: string) => {
    setInquiryType(value);
    onFilterChange({ search, inquiryType: value, read, responded });
  };

  const handleReadChange = (value: string) => {
    setRead(value);
    onFilterChange({ search, inquiryType, read: value, responded });
  };

  const handleRespondedChange = (value: string) => {
    setResponded(value);
    onFilterChange({ search, inquiryType, read, responded: value });
  };

  const handleClear = () => {
    setSearch('');
    setInquiryType('');
    setRead('');
    setResponded('');
    onFilterChange({ search: '', inquiryType: '', read: '', responded: '' });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-md)',
        padding: 'var(--spacing-lg)',
        backgroundColor: 'var(--color-background)',
        borderRadius: 'var(--radius-lg)',
        marginBottom: 'var(--spacing-lg)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-md)',
        }}
      >
        <div>
          <label
            htmlFor="search"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
            }}
          >
            Search
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search contacts..."
            style={{
              width: '100%',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: '1px solid var(--color-text-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="inquiryType"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
            }}
          >
            Inquiry Type
          </label>
          <select
            id="inquiryType"
            value={inquiryType}
            onChange={(e) => handleInquiryTypeChange(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: '1px solid var(--color-text-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
            }}
          >
            <option value="">All Types</option>
            <option value="GENERAL_INQUIRY">General Inquiry</option>
            <option value="REQUEST_DEMO">Request Demo</option>
            <option value="CONTACT_SALES">Contact Sales</option>
            <option value="TECHNICAL_SUPPORT">Technical Support</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="read"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
            }}
          >
            Read Status
          </label>
          <select
            id="read"
            value={read}
            onChange={(e) => handleReadChange(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: '1px solid var(--color-text-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
            }}
          >
            <option value="">All</option>
            <option value="false">Unread</option>
            <option value="true">Read</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="responded"
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
            }}
          >
            Response Status
          </label>
          <select
            id="responded"
            value={responded}
            onChange={(e) => handleRespondedChange(e.target.value)}
            style={{
              width: '100%',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: '1px solid var(--color-text-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
            }}
          >
            <option value="">All</option>
            <option value="false">Not Responded</option>
            <option value="true">Responded</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={handleClear}
        style={{
          alignSelf: 'flex-start',
          padding: 'var(--spacing-sm) var(--spacing-md)',
          backgroundColor: 'var(--color-background-secondary)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-text-tertiary)',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)',
          cursor: 'pointer',
        }}
      >
        Clear Filters
      </button>
    </div>
  );
}

