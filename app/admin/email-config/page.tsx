import EmailConfigForm from '@/components/admin/EmailConfigForm';

export default function EmailConfigPage() {
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
        Email Configuration
      </h1>
      <EmailConfigForm />
    </div>
  );
}

