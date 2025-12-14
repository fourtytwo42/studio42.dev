'use client';

import { useState, useEffect } from 'react';

interface EmailConfig {
  id: string;
  enabled: boolean;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUser: string | null;
  smtpSecure: boolean;
  fromEmail: string | null;
  fromName: string | null;
  adminEmail: string | null;
  confirmationTemplate: string | null;
  notificationTemplate: string | null;
}

export default function EmailConfigForm() {
  const [config, setConfig] = useState<EmailConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/admin/email-config');
        if (!response.ok) {
          throw new Error('Failed to fetch email configuration');
        }
        const data = await response.json();
        setConfig(data.config);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        enabled: formData.get('enabled') === 'on',
        smtpHost: formData.get('smtpHost') || null,
        smtpPort: formData.get('smtpPort') || null,
        smtpUser: formData.get('smtpUser') || null,
        smtpPassword: formData.get('smtpPassword') || undefined,
        smtpSecure: formData.get('smtpSecure') === 'on',
        fromEmail: formData.get('fromEmail') || null,
        fromName: formData.get('fromName') || null,
        adminEmail: formData.get('adminEmail') || null,
        confirmationTemplate: formData.get('confirmationTemplate') || null,
        notificationTemplate: formData.get('notificationTemplate') || null,
      };

      const response = await fetch('/api/admin/email-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save configuration');
      }

      const result = await response.json();
      setConfig(result.config);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleTestEmail = async () => {
    if (!config?.adminEmail) {
      setTestResult({ success: false, message: 'Please set an admin email address first' });
      return;
    }

    setTesting(true);
    setTestResult(null);
    setError(null);

    try {
      const response = await fetch('/api/admin/email-config/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: config.adminEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send test email');
      }

      setTestResult({ success: true, message: data.message || 'Test email sent successfully!' });
    } catch (err) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : 'Failed to send test email',
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 'var(--spacing-5xl)' }}>Loading...</div>;
  }

  if (!config) {
    return <div style={{ textAlign: 'center', padding: 'var(--spacing-5xl)', color: 'var(--color-error)' }}>Failed to load configuration</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-lg)',
        maxWidth: '800px',
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
          Email Settings
        </h2>

        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              name="enabled"
              defaultChecked={config.enabled}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
            />
            Enable Email Notifications
          </label>
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
        <h2
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          SMTP Configuration
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-md)',
          }}
        >
          <div>
            <label
              htmlFor="smtpHost"
              style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
              }}
            >
              SMTP Host
            </label>
            <input
              id="smtpHost"
              name="smtpHost"
              type="text"
              defaultValue={config.smtpHost || ''}
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
              htmlFor="smtpPort"
              style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
              }}
            >
              SMTP Port
            </label>
            <input
              id="smtpPort"
              name="smtpPort"
              type="number"
              defaultValue={config.smtpPort || ''}
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
              htmlFor="smtpUser"
              style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
              }}
            >
              SMTP Username
            </label>
            <input
              id="smtpUser"
              name="smtpUser"
              type="text"
              defaultValue={config.smtpUser || ''}
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
              htmlFor="smtpPassword"
              style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
              }}
            >
              SMTP Password
            </label>
            <input
              id="smtpPassword"
              name="smtpPassword"
              type="password"
              placeholder="Leave blank to keep current"
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
        </div>

        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--color-text-primary)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              name="smtpSecure"
              defaultChecked={config.smtpSecure}
              style={{
                width: '20px',
                height: '20px',
                cursor: 'pointer',
              }}
            />
            Use Secure Connection (TLS/SSL)
          </label>
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
        <h2
          style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-primary)',
            marginBottom: 'var(--spacing-md)',
          }}
        >
          Email Addresses
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-md)',
          }}
        >
          <div>
            <label
              htmlFor="fromEmail"
              style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
              }}
            >
              From Email
            </label>
            <input
              id="fromEmail"
              name="fromEmail"
              type="email"
              defaultValue={config.fromEmail || ''}
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
              htmlFor="fromName"
              style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
              }}
            >
              From Name
            </label>
            <input
              id="fromName"
              name="fromName"
              type="text"
              defaultValue={config.fromName || ''}
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
              htmlFor="adminEmail"
              style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
              }}
            >
              Admin Notification Email
            </label>
            <input
              id="adminEmail"
              name="adminEmail"
              type="email"
              defaultValue={config.adminEmail || ''}
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
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-error)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-status-available-bg)',
            color: 'var(--color-status-available)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          Configuration saved successfully!
        </div>
      )}

      {testResult && (
        <div
          style={{
            padding: 'var(--spacing-md)',
            backgroundColor: testResult.success
              ? 'var(--color-status-available-bg)'
              : 'var(--color-error)',
            color: testResult.success
              ? 'var(--color-status-available)'
              : 'white',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
          }}
        >
          {testResult.message}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
        }}
      >
        <button
          type="button"
          onClick={handleTestEmail}
          disabled={testing || !config?.adminEmail}
          style={{
            padding: 'var(--spacing-md) var(--spacing-xl)',
            backgroundColor: testing || !config?.adminEmail
              ? 'var(--color-text-tertiary)'
              : 'var(--color-background-secondary)',
            color: testing || !config?.adminEmail
              ? 'var(--color-text-tertiary)'
              : 'var(--color-text-primary)',
            border: '1px solid var(--color-text-tertiary)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            cursor: testing || !config?.adminEmail ? 'not-allowed' : 'pointer',
            transition: 'var(--transition-base)',
          }}
        >
          {testing ? 'Sending...' : 'Send Test Email'}
        </button>

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: 'var(--spacing-md) var(--spacing-xl)',
            backgroundColor: saving ? 'var(--color-text-tertiary)' : 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-semibold)',
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'var(--transition-base)',
          }}
        >
          {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </form>
  );
}

