'use client';

import { useAppSelector } from '@/hook/hook';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { parseCookies } from 'nookies';

const LoginWrapper = ({
  children,
  params: { locale }
}: {
  children: ReactNode;
  params: { locale: string };
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const userId = useAppSelector(state => state.auth.userId);
  const cookies = parseCookies();
  const accessToken = cookies['access_token'];

  const homePage = pathname === `/${locale}`;

  // accessToken 존재 여부
  // const isLogin = !userId || !userId.id || userId.id === "";
  const isLogin = !userId || !userId.id;

  console.log('isLogin', isLogin);
  console.log('userId', userId?.id);
  // const isLogin = !!accessToken;

  useEffect(() => {
    if (isLogin) {
      let isLoginPage = false;
      if (locale === 'en') {
        router.push(`/login`);
      } else {
        router.push(`/${locale}/login`);
      }
    } else if (homePage) {
      router.push(`/${locale}/dashboard`);
    }
  }, []);

  return <>{children}</>;
};

export default LoginWrapper;

// document.cookie = `access_token=${accessToken}; path=/`;
