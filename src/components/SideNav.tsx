'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

export default function SideNav() {
  const { t } = useTranslation();

  return (
    <nav className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <div className="text-2xl font-bold mb-6">
        <Link href="/">{t('welcome')}</Link>
      </div>
      <LanguageSwitcher />
      <ul className="space-y-2">
        <li>
          <Link href="/contacts" className="block py-2 px-4 rounded hover:bg-gray-700">
            {t('contacts')}
          </Link>
        </li>
        <li>
          <Link href="/leads" className="block py-2 px-4 rounded hover:bg-gray-700">
            {t('leads')}
          </Link>
        </li>
        <li>
          <Link href="/deals" className="block py-2 px-4 rounded hover:bg-gray-700">
            {t('deals')}
          </Link>
        </li>
        <li>
          <Link href="/marketing" className="block py-2 px-4 rounded hover:bg-gray-700">
            {t('marketing')}
          </Link>
        </li>
        <li>
          <Link href="/customerservice" className="block py-2 px-4 rounded hover:bg-gray-700">
            {t('customer_service')}
          </Link>
        </li>
        <li>
          <Link href="/workflow" className="block py-2 px-4 rounded hover:bg-gray-700">
            {t('workflow')}
          </Link>
        </li>
        <li>
          <Link href="/communication" className="block py-2 px-4 rounded hover:bg-gray-700">
            {t('communication')}
          </Link>
        </li>
        <li>
          <Link href="/customization" className="block py-2 px-4 rounded hover:bg-gray-700">
            {t('customization')}
          </Link>
        </li>
        <li>
          <Link href="/ai-ml" className="block py-2 px-4 rounded hover:bg-gray-700">
            {t('ai_ml')}
          </Link>
        </li>
        <li>
          <Link href="/quotes-proposals" className="block py-2 px-4 rounded hover:bg-gray-700">
            {t('quotes_proposals')}
          </Link>
        </li>
        <li>
          <Link href="/territory-team" className="block py-2 px-4 rounded hover:bg-gray-700">
            {t('territory_team')}
          </Link>
        </li>
        <li>
          <Link href="/data-management" className="block py-2 px-4 rounded hover:bg-gray-700">
            {t('data_management')}
          </Link>
        </li>
        <li>
          <Link href="/analytics-reporting" className="block py-2 px-4 rounded hover:bg-gray-700">
            {t('analytics_reporting')}
          </Link>
        </li>
        <li>
          <button
            onClick={async () => {
              await fetch('/api/logout');
              window.location.href = '/login';
            }}
            className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700"
          >
            {t('logout')}
          </button>
        </li>
      </ul>
    </nav>
  );
}