import type { Metadata } from 'next';
import Script from 'next/script';
import '../styles/globals.css';
import '../styles/utilities.css';
import '../styles/animations.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import ChatWidget from '@/components/ai/ChatWidget';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Studio42.dev - Premium SaaS Products',
  description: 'Premium SaaS product showcase and marketing website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'light' || theme === 'dark') {
                    document.documentElement.classList.remove('light', 'dark');
                    document.documentElement.classList.add(theme);
                  } else {
                    document.documentElement.classList.remove('light', 'dark');
                    document.documentElement.classList.add('dark');
                    localStorage.setItem('theme', 'dark');
                  }
                } catch (e) {
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <ThemeProvider>
          {children}
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}

