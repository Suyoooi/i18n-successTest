import LanguageChanger from '@/app/[locale]/components/LanguageChanger';
// import TranslationsProvider from '@/app/[locale]/components/TranslationsProvider';
import BackButton from './about/BackButton';
import initTranslations from '@/i18n';

const i18nNamespaces = ['home'];

async function About({ params: { locale } }: { params: { locale: string } }) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <main>
      <h1>{t('about_header')}</h1>
    </main>
  );
}

export default About;
