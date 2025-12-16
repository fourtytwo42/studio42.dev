'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/shared/ThemeToggle';

interface AdminHeaderProps {
  email: string;
}

export default function AdminHeader({ email }: AdminHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirectTo: '/admin/login' });
    router.refresh();
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-md)',
      fontSize: 'var(--font-size-sm)',
      color: 'var(--color-text-secondary)',
    }}>
      <span style={{ color: 'var(--color-text-primary)' }}>{email}</span>
      <ThemeToggle />
      <button
        onClick={handleLogout}
        type="button"
        style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          backgroundColor: 'transparent',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-text-tertiary)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          fontSize: 'var(--font-size-sm)',
          transition: 'var(--transition-base)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-background-secondary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        Logout
      </button>
    </div>
  );
}

