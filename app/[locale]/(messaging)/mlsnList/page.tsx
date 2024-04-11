'use client';

import 'react-tabulator/lib/styles.css';
import React, { useEffect } from 'react';
import VpnPage from '@/app/[locale]/(messaging)/mlsnList/common/vpnPage';
import { useAppDispatch, useAppSelector } from '@/hook/hook';
import { usePathname } from 'next/navigation';
import {
  setSelectedRow,
  setSelectedId,
  setSelectedMsnId
} from '@/redux/slices/vpn/vpnSlice';
import { setVpnInfo } from '@/redux/slices/vpn/monitorVpnSlice';

const MessageVpns = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const selectedRow = useAppSelector(state => state.isVpn.selectedRow);

  useEffect(() => {
    if (pathname.includes('/mlsnmList')) {
      dispatch(setSelectedRow({ msgVpnName: '' }));
      dispatch(setSelectedMsnId({ msnId: '' }));
      dispatch(setSelectedId({ mlsnSn: '' }));
      dispatch(setVpnInfo({ msgVpnName: '', msnId: '' }));
    }
  }, [pathname, dispatch]);

  return (
    <>
      <VpnPage />
    </>
  );
};

export default MessageVpns;
