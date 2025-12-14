import type { Metadata } from 'next';
import '../styles/globals.css';
import '../styles/utilities.css';
import '../styles/animations.css';
import ChatWidget from '@/components/ai/ChatWidget';

export const metadata: Metadata = {
  title: 'Studio42.dev - Premium SaaS Products',
  description: 'Premium SaaS product showcase and marketing website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}

