'use client';

import React, { Suspense, useEffect } from 'react';
import { useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import initTranslations from '@/i18n';

const i18nNamespaces = ['home'];

// export default function Layout(props: { tabs: ReactNode }) {
export default function Layout({
  tabs,
  params: { locale }
}: {
  tabs: ReactNode;
  params: { locale: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [index, setIndex] = useState(0);

  const [t, setT] = useState({
    t: (p0: string) => locale,
    resources: {}
  });

  useEffect(() => {
    const loadTranslations = async () => {
      const { t, resources } = await initTranslations(locale, i18nNamespaces);
      setT({ t, resources });
    };

    loadTranslations();
  }, [locale]);

  const activeLink = (id: number, contentUrl: string, disableGbn: boolean) => {
    if (disableGbn) {
      return contentUrl === pathname ? 'nav-link active' : 'nav-link';
    } else {
      return 'nav-link disabled';
    }
  };

  const data = [
    { id: 0, title: t.t('MUL_WD_0049'), contentUrl: '/msg', disableGbn: true },
    {
      id: 1,
      title: t.t('MUL_WD_0050'),
      contentUrl: '/msg/failure',
      disableGbn: false
    },
    {
      id: 2,
      title: t.t('MUL_WD_0051'),
      contentUrl: '/msg/exceptions',
      disableGbn: false
    }
    // { id: 3, title: "Alert Rule Manager", contentUrl: "/msg/rule", disableGbn: false },
  ];

  const fnMovePage = (url: string, id: number) => {
    console.log(url);
    setIndex(id);
    router.push(url);
  };

  const fnAddRule = () => {
    router.push('/addRule');
  };

  // if (isLoading) {
  //   return <div style={{ background: '#fff' }}>Loading translations...</div>;
  // } else {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="content__wrap sol_content_pb50">
          <div className="sol_breadcrumb_area">
            <div className="row">
              <div className="row d-flex col-md-8">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item active" aria-current="page">
                      {t.t('MUL_WD_0043')}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          <div className="tab-base">
            <div className="position-relative">
              <ul className="nav nav-callout" role="tablist">
                {data.map(item => (
                  <li className="nav-item" role="presentation" key={item.id}>
                    <button
                      className={activeLink(
                        item.id,
                        item.contentUrl,
                        item.disableGbn
                      )}
                      data-bs-toggle="tab"
                      data-bs-target="#tabsHome"
                      type="button"
                      role="tab"
                      aria-controls="home"
                      aria-selected="true"
                      onClick={() => fnMovePage(item.contentUrl, item.id)}>
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="d-flex position-absolute justify-content-end gap-2 sol_tab_rigbtn">
                {pathname.includes('/msg') ? (
                  <>
                    <a
                      className="btn hstack btn-outline-info"
                      onClick={() => fnAddRule()}>
                      + {t.t('MUL_WD_0043')}
                    </a>
                  </>
                ) : null}
              </div>
            </div>
            {data
              .filter(item => index === item.id)
              .map(item => (
                <div key={item.id}>{tabs}</div>
              ))}
          </div>
        </div>
      </Suspense>
    </>
  );
  // }
}
