import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { headers } from 'next/headers';
import SideNav from '@/components/SideNav';
import I18nProvider from '@/components/I18nProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Professional CRM",
  description: "A comprehensive CRM solution",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const isLoggedIn = headersList.get('x-logged-in') === 'true';

  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <div className="flex h-screen bg-gray-100">
            {isLoggedIn && <SideNav />}
            <main className="flex-1 p-6 overflow-y-auto">
              {children}
            </main>
          </div>
        </I18nProvider>
      </body>
    </html>
  );
}