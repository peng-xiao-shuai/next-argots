import { useTranslation } from '@/locales/i18n';
import { Lng } from '@/locales/i18n';
import { LocaleContext } from '@/context';

export async function LocaleProvider({
  children,
  language,
}: {
  children: React.ReactNode;
  language: Lng;
}) {
  const { t } = await useTranslation(language);
  return (
    <LocaleContext.Provider
      value={{
        language,
        t,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}
