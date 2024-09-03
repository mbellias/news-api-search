import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import SearchFormContextProvider from '@/components/context/SearchFormContext';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Search Form - News API',
  description:
    "A search form that queries the News API's 'everything' endpoint.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <SearchFormContextProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            themes={['light', 'dark', 'system']}
            enableSystem
            disableTransitionOnChange
          >
            <Toaster />
            {children}
          </ThemeProvider>
        </SearchFormContextProvider>
      </body>
    </html>
  );
}
