import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-semibold text-gray-800">{t('dashboard.title')}</h1>
      <p className="mt-2 text-gray-500">{t('dashboard.placeholder')}</p>
    </div>
  );
}
