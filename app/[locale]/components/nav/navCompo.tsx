'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hook/hook';
import {
  setSelectedRow,
  setSelectedId,
  setSelectedMsnId
} from '@/redux/slices/vpn/vpnSlice';
import { useEffect, useState } from 'react';
import { setSelectedQueue } from '@/redux/slices/queue/queueSlice';
import { useTranslation } from 'react-i18next';
import initTranslations from '@/i18n';
import useCustomTranslations from '@/hook/useCustomTranslations';

const i18nNamespaces = ['home'];

// const NavItem = () => {
function NavItem({ params: { locale } }: { params: { locale: string } }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const selectedRow = useAppSelector(state => state.isVpn.selectedRow);

  const t = useCustomTranslations(locale, ['home']);

  const normalizePathname = (pathname: string) => {
    const regex = /^\/[a-zA-Z]{2}(\/|$)/;
    return pathname.replace(regex, '/');
  };
  const normalizedPathname = normalizePathname(pathname);

  // 특정 url 에서 redux에 저장된 msgVpnName을 null로 저장
  useEffect(() => {
    if (normalizedPathname === '/mlsnList') {
      dispatch(setSelectedRow({ msgVpnName: '' }));
      dispatch(setSelectedId({ mlsnSn: '' }));
      dispatch(setSelectedMsnId({ msnId: '' }));
      dispatch(setSelectedQueue({ queueName: '' }));
    } else if (normalizedPathname === '/mlsnList') {
      router.push('/monitor');
    }
  }, [pathname, dispatch]);

  const activeLink = (url: string, pathname: string) => {
    const normalizedPathname = normalizePathname(pathname);
    const findData = url.includes(normalizedPathname);

    if (findData) {
      return 'nav-link active';
    } else {
      return 'nav-link';
    }
  };

  const arrActiveLink = (url: string[]) => {
    const findData = url.includes(normalizedPathname);

    if (findData) {
      return 'mininav-toggle nav-link active';
    } else {
      return 'mininav-toggle nav-link collapsed';
    }
  };

  const ulShowLink = (url: string[]) => {
    const findData = url.includes(normalizedPathname);

    if (findData) {
      return 'mininav-content nav show collapse';
    } else {
      return 'mininav-content nav collapse';
    }
  };

  const arrMainActiveLink = (url: string[]) => {
    const findData = url.includes(normalizedPathname);

    if (findData) {
      return 'nav-link active';
    } else {
      return 'nav-link';
    }
  };

  const subActiveLink = (
    url: string,
    activeUrl: string[],
    pathname: string
  ) => {
    const findData = activeUrl.includes(normalizedPathname);

    if (findData) {
      return 'nav-link active';
    } else {
      return 'nav-link';
    }
  };

  const menuItem = [
    {
      id: 10000,
      // name: '대시보드',
      items: [
        {
          id: 10010,
          name: t.t('10'),
          activeUrl: ['/dashboard'],
          url: '/dashboard',
          imgUrl: 'sol_i_menu sol_i_dashboard',
          imgAlt: 'DashBoard',
          subItems: []
        },
        {
          id: 10011,
          name: t.t('11'),
          activeUrl: [`/monitor`],
          url: `/monitor`,
          imgUrl: 'sol_i_menu sol_i_monitoring',
          imgAlt: 'Monitoring',
          subItems: []
        },
        {
          id: 10012,
          name: t.t('12'),
          activeUrl: [
            '/msg',
            '/msg/failure',
            '/msg/exceptions',
            '/msg/rule',
            // "/addRule",
            // "/addRule/step1",
            // "/addRule/step2",
            // "/addRule/step3",
            // "/addRule/step4",
            '/rule',
            '/rule/step1',
            '/rule/step2',
            '/rule/step3',
            '/rule/step4'
          ],
          url: '/msg',
          imgUrl: 'sol_i_menu sol_i_alertmanagement',
          imgAlt: 'Alert Message',
          subItems: []
        }
      ]
    },
    {
      id: 20000,
      items: [
        {
          id: 20010,
          name: t.t('13'),
          activeUrl: [
            '/mlsnList',
            '/mlsnm',
            '/mlsnm/settings',
            '/channelList',
            '/channel',
            '/channel/settings',
            '/channel/settings/edit',
            '/edit/mlsnm/settings'
          ],
          url: '',
          imgUrl: 'sol_i_menu sol_i_messagebr',
          imgAlt: 'Message VPNs',
          subItems: [
            {
              id: 20020,
              name: 'Message VPNs',
              activeUrl: ['/mlsnList'],
              url: '/mlsnList'
            },
            // msgVpnName이 ""가 아닐 경우에 메뉴를 보여줌
            ...(selectedRow?.msgVpnName !== ''
              ? [
                  {
                    id: 20021,
                    name: t.t('13'),
                    activeUrl: [
                      '/mlsnm',
                      '/mlsnm/settings',
                      '/edit/mlsnm/settings'
                    ],
                    url: '/mlsnm'
                  },
                  {
                    id: 20022,
                    name: 'Queues',
                    activeUrl: [
                      '/channelList',
                      '/channel',
                      '/channel/settings',
                      '/channel/settings/edit'
                    ],
                    url: '/channelList'
                  }
                ]
              : [])
          ]
        }
      ]
    },
    {
      id: 30000,
      items: [
        {
          id: 30010,
          name: t.t('14'),
          activeUrl: [`/about`],
          url: ``,
          imgUrl: 'sol_i_menu sol_i_messagebr',
          imgAlt: `Message VPNs`,
          subItems: [
            {
              id: 30020,
              name: `Test_about`,
              activeUrl: [`/about`],
              url: `/about`
            }
          ]
        }
      ]
    }
  ];

  return (
    <>
      {menuItem.map((item: any, idx: number) => (
        <div className="mainnav__categoriy" key={item.id}>
          <ul className="mainnav__menu nav flex-column">
            {item.items.map((subItem: any) =>
              subItem.subItems.length === 0 ? (
                subItem.activeUrl.length === 1 ? (
                  <li className="nav-item has-sub" key={subItem.id}>
                    <Link
                      href={subItem.url}
                      className={activeLink(subItem.url, pathname)}>
                      <span className={subItem.imgUrl}></span>
                      <span className="nav-label sol_ml_6">{subItem.name}</span>
                    </Link>
                  </li>
                ) : (
                  <li className="nav-item has-sub" key={subItem.id}>
                    <Link
                      href={subItem.url}
                      className={arrMainActiveLink(subItem.activeUrl)}>
                      <span className={subItem.imgUrl}></span>
                      <span className="nav-label sol_ml_6">{subItem.name}</span>
                    </Link>
                  </li>
                )
              ) : (
                <li className="nav-item has-sub" key={subItem.id}>
                  <Link
                    href={subItem.activeUrl[0]}
                    className={arrActiveLink(subItem.activeUrl)}>
                    <span className={subItem.imgUrl} />
                    <span className="nav-label sol_ml_6">{subItem.name}</span>
                  </Link>

                  <ul className={ulShowLink(subItem.activeUrl)}>
                    {subItem.subItems.map((sub: any) => (
                      <li className="nav-item" key={sub.id}>
                        <Link
                          href={sub.url}
                          className={subActiveLink(
                            sub.url,
                            sub.activeUrl,
                            pathname
                          )}>
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            )}
          </ul>
        </div>
      ))}
    </>
  );
}
export default NavItem;
