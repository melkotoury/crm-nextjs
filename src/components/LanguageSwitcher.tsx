'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // This is a simplified approach. In a real app, you might want to
    // persist the language choice and redirect to the same path in the new locale.
    router.push(`/${lng}${router.pathname}`);
  };

  return (
    <div className="mb-4">
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        value={i18n.language}
        className="bg-gray-700 text-white p-2 rounded w-full"
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="it">Italiano</option>
        <option value="ja">日本語</option>
        <option value="zh">中文</option>
      </select>
    </div>
  );
}