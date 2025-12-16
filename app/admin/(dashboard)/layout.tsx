import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If no session, redirect to login (but login page will handle its own rendering)
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-background-secondary)',
    }}>
      <nav style={{
        backgroundColor: 'var(--color-background)',
        borderBottom: '1px solid var(--color-background-tertiary)',
        padding: 'var(--spacing-md) var(--spacing-xl)',
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h1 style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
          }}>
            Admin Dashboard
          </h1>
          <AdminHeader email={session.user?.email || ''} />
        </div>
      </nav>
      <div style={{
        backgroundColor: 'var(--color-background)',
        borderBottom: '1px solid var(--color-background-tertiary)',
        padding: 'var(--spacing-sm) var(--spacing-xl)',
      }}>
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-lg)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <Link
            href="/admin/dashboard"
            style={{
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/contacts"
            style={{
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            Contacts
          </Link>
          <Link
            href="/admin/email-config"
            style={{
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            Email Config
          </Link>
        </div>
      </div>
      <main style={{
        padding: 'var(--spacing-xl)',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
      }}>
        {children}
      </main>
    </div>
  );
}

