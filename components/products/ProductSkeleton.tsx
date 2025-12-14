export default function ProductSkeleton() {
  return (
    <div
      className="product-skeleton"
      style={{
        backgroundColor: 'var(--color-background)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image skeleton */}
      <div
        style={{
          width: '100%',
          paddingTop: '56.25%',
          backgroundColor: 'var(--color-background-tertiary)',
          position: 'relative',
        }}
      >
        <div
          className="skeleton-shimmer"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          }}
        />
      </div>

      <div
        style={{
          padding: 'var(--spacing-lg)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Title skeleton */}
        <div
          style={{
            height: '24px',
            width: '60%',
            backgroundColor: 'var(--color-background-tertiary)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--spacing-sm)',
          }}
        />

        {/* Tagline skeleton */}
        <div
          style={{
            height: '16px',
            width: '80%',
            backgroundColor: 'var(--color-background-tertiary)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--spacing-md)',
          }}
        />

        {/* Description skeleton */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-xs)',
            marginBottom: 'var(--spacing-md)',
            flex: 1,
          }}
        >
          <div
            style={{
              height: '16px',
              width: '100%',
              backgroundColor: 'var(--color-background-tertiary)',
              borderRadius: 'var(--radius-sm)',
            }}
          />
          <div
            style={{
              height: '16px',
              width: '90%',
              backgroundColor: 'var(--color-background-tertiary)',
              borderRadius: 'var(--radius-sm)',
            }}
          />
          <div
            style={{
              height: '16px',
              width: '75%',
              backgroundColor: 'var(--color-background-tertiary)',
              borderRadius: 'var(--radius-sm)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
