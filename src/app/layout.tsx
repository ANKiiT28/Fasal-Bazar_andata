
import type {Metadata} from 'next';
import { PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/auth-context';
import { LoginDialog } from '@/components/auth/login-dialog';
import { LanguageProvider } from '@/context/language-context';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Annadata Connect',
  description: 'A marketplace connecting farmers directly with buyers, featuring AI-powered price suggestions, market trends, and multilingual support.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ptSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AuthProvider>
          <LanguageProvider>
            {children}
            <Toaster />
            <LoginDialog />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
