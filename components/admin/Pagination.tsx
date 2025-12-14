'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = [];
  const maxVisible = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        marginTop: 'var(--spacing-lg)',
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          backgroundColor: currentPage === 1 ? 'var(--color-background-tertiary)' : 'var(--color-background)',
          color: currentPage === 1 ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
          border: '1px solid var(--color-text-tertiary)',
          borderRadius: 'var(--radius-md)',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          fontSize: 'var(--font-size-sm)',
        }}
      >
        Previous
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-text-tertiary)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            1
          </button>
          {startPage > 2 && <span style={{ color: 'var(--color-text-secondary)' }}>...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: page === currentPage ? 'var(--color-primary)' : 'var(--color-background)',
            color: page === currentPage ? 'white' : 'var(--color-text-primary)',
            border: '1px solid var(--color-text-tertiary)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: page === currentPage ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
          }}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span style={{ color: 'var(--color-text-secondary)' }}>...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: 'var(--color-background)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-text-tertiary)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: 'var(--spacing-sm) var(--spacing-md)',
          backgroundColor: currentPage === totalPages ? 'var(--color-background-tertiary)' : 'var(--color-background)',
          color: currentPage === totalPages ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
          border: '1px solid var(--color-text-tertiary)',
          borderRadius: 'var(--radius-md)',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          fontSize: 'var(--font-size-sm)',
        }}
      >
        Next
      </button>
    </div>
  );
}

