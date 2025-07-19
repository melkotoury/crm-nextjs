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
        <div className="flex h-screen bg-gray-100">
          <nav className="w-64 bg-gray-800 text-white flex flex-col p-4">
            <div className="text-2xl font-bold mb-6">
              <Link href="/">CRM Dashboard</Link>
            </div>
            <ul className="space-y-2">
              <li>
                <Link href="/contacts" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Contacts
                </Link>
              </li>
              <li>
                <Link href="/leads" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Leads
                </Link>
              </li>
              <li>
                <Link href="/deals" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="/marketing" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Marketing
                </Link>
              </li>
              <li>
                <Link href="/customerservice" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="/workflow" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Workflow
                </Link>
              </li>
              <li>
                <Link href="/communication" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Communication
                </Link>
              </li>
              <li>
                <Link href="/customization" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Customization
                </Link>
              </li>
              <li>
                <Link href="/ai-ml" className="block py-2 px-4 rounded hover:bg-gray-700">
                  AI & ML
                </Link>
              </li>
              <li>
                <Link href="/quotes-proposals" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Quotes & Proposals
                </Link>
              </li>
              <li>
                <Link href="/territory-team" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Territory & Team
                </Link>
              </li>
              <li>
                <Link href="/data-management" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Data Management
                </Link>
              </li>
              <li>
                <Link href="/analytics-reporting" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Analytics & Reporting
                </Link>
              </li>
            </ul>
          </nav>
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}