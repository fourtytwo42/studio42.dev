import ContactConfirmation from '@/components/contact/ContactConfirmation';

export const metadata = {
  title: 'Message Sent - Studio42.dev',
  description: 'Thank you for contacting Studio42.dev. We\'ll get back to you soon.',
};

export default function ContactConfirmationPage() {
  return (
    <main>
      <section
        style={{
          padding: 'var(--spacing-5xl) var(--spacing-xl)',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div className="container">
          <ContactConfirmation />
        </div>
      </section>
    </main>
  );
}

