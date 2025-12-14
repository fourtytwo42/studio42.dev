import { ProductStatus } from '@prisma/client';

interface StatusBadgeProps {
  status: ProductStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    AVAILABLE: {
      label: 'Available',
      className: 'status-badge-available',
    },
    COMING_SOON: {
      label: 'Coming Soon',
      className: 'status-badge-coming-soon',
    },
    IN_DEVELOPMENT: {
      label: 'In Development',
      className: 'status-badge-in-development',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={config.className}
      style={{
        display: 'inline-block',
        padding: 'var(--spacing-xs) var(--spacing-sm)',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 'var(--font-weight-medium)',
        backgroundColor:
          status === 'AVAILABLE'
            ? 'var(--color-status-available-bg)'
            : status === 'COMING_SOON'
            ? 'var(--color-status-coming-soon-bg)'
            : 'var(--color-status-in-development-bg)',
        color:
          status === 'AVAILABLE'
            ? 'var(--color-status-available)'
            : status === 'COMING_SOON'
            ? 'var(--color-status-coming-soon)'
            : 'var(--color-status-in-development)',
      }}
    >
      {config.label}
    </span>
  );
}

