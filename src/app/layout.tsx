import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Professional CRM",
  description: "A comprehensive CRM solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between">
            <Link href="/" className="text-white font-bold">CRM</Link>
            <div>
              <Link href="/" className="text-gray-300 hover:text-white mr-4">Contacts</Link>
              <Link href="/leads" className="text-gray-300 hover:text-white mr-4">Leads</Link>
              <Link href="/deals" className="text-gray-300 hover:text-white mr-4">Deals</Link>
              <Link href="/marketing" className="text-gray-300 hover:text-white mr-4">Marketing</Link>
              <Link href="/customerservice" className="text-gray-300 hover:text-white mr-4">Customer Service</Link>
              <Link href="/workflow" className="text-gray-300 hover:text-white mr-4">Workflow</Link>
              <Link href="/communication" className="text-gray-300 hover:text-white mr-4">Communication</Link>
              <Link href="/customization" className="text-gray-300 hover:text-white">Customization</Link>
              <Link href="/roles-permissions" className="text-gray-300 hover:text-white">Roles & Permissions</Link>
              <Link href="/integrations" className="text-gray-300 hover:text-white">Integrations</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
