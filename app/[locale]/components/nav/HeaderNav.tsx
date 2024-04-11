'use client';

import { useAppDispatch, useAppSelector } from '@/hook/hook';
import Image from 'next/image';
import { setUserId } from '@/redux/slices/login/authSlice';
import { useRouter } from 'next/navigation';
import LanguageChanger from '../LanguageChanger';
import { useEffect, useState } from 'react';
import initTranslations from '@/i18n';
import TranslationsProvider from '../TranslationsProvider';
import { useTranslation } from 'react-i18next';

const i18nNamespaces = ['home'];

function HeaderNav({ params: { locale } }: { params: { locale: string } }) {
  const router = useRouter();
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
  }, [locale]);

  const userId = useAppSelector(state => state.auth.userId);
  const dispatch = useAppDispatch();

  const fnLogOut = () => {
    dispatch(setUserId({ id: '' }));
    console.log(locale);
    router.push(`/${locale}/login`);
  };
  const modalOpen = useAppSelector(state => state.modal.isOpen);
  const alertOpen = useAppSelector(state => state.alert.isOpen);
  return (
    <>
      {modalOpen && <div className="modal_ly_bg" />}
      {alertOpen && <div className="alert_ly_bg" />}
      <header className="header">
        <div className="header__inner">
          <div className="sol_header_menuopen">
            <button
              type="button"
              className="nav-toggler header__btn btn btn-icon btn-sm">
              <i className="sol_i_menuopen" />
            </button>
          </div>
          <div className="header__brand">
            <div className="brand-title">ACell EMMA</div>
            <div className="brand-wrap" title="EMAMS">
              <a className="brand-img stretched-link" href="/">
                <Image
                  src={'/assets/img/solace_img/bi_img.png'}
                  width={19}
                  height={17}
                  alt="logo"
                />
              </a>
            </div>
          </div>

          <div className="header__content row">
            <div className="header__content-end d-flex justify-content-end">
              <div className="sol_header_menu">
                <button className="header__btn btn btn-icon btn-sm" disabled>
                  <i className="sol_i_message"></i>
                </button>
                <button className="header__btn btn btn-icon btn-sm" disabled>
                  <i className="sol_i_alrm"></i>
                </button>
                <button
                  className="header__btn btn btn-icon btn-sm sol_r_6"
                  disabled>
                  <i className="sol_i_sound"></i>
                </button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <TranslationsProvider
                  namespaces={i18nNamespaces}
                  locale={locale}
                  resources={translations.resources}>
                  <LanguageChanger />
                </TranslationsProvider>
                <div className="btn-group">
                  <a
                    className="btn btn-sm hstack sol_btn_language"
                    data-bs-toggle="dropdown">
                    {userId?.id}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" onClick={() => fnLogOut()}>
                        {/* Logout */}
                        {translations.t('09')}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default HeaderNav;
