import BackButton from './BackButton';
import styles from '../page.module.css';
import LanguageChanger from '@/app/[locale]/components/LanguageChanger';
import TranslationsProvider from '@/app/[locale]/components/TranslationsProvider';
import initTranslations from '@/i18n';
import VpnPage from '../(messaging)/mlsnList/common/vpnPage';

const i18nNamespaces = ['about'];

async function About({ params: { locale } }: { params: { locale: string } }) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}>
      <main className={styles.main}>
        <h1>{t('about_header')}</h1>
        <BackButton />
        <LanguageChanger />
      </main>
    </TranslationsProvider>
  );
}

export default About;
