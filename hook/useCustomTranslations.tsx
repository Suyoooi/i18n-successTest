import { useState, useEffect } from 'react';
import initTranslations from '@/i18n';

function useCustomTranslations(locale: string, i18nNamespaces: string[]) {
  const [translations, setTranslations] = useState({
    t: (p0: string) => locale,
    resources: {}
  });

  useEffect(() => {
    const loadTranslations = async () => {
      const { t, resources } = await initTranslations(locale, i18nNamespaces);
      setTranslations({ t, resources });
    };

    loadTranslations();
  }, [locale, i18nNamespaces]);

  return translations;
}

export default useCustomTranslations;
