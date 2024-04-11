'use client';

import { useState, type ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hook/hook';
import Advenced from '@/app/[locale]/(messaging)/mlsnm/@tabs/common/settings/advenced';
import Information from '@/app/[locale]/(messaging)/mlsnm/@tabs/common/settings/information';
import { VpnTipsData } from '@/data/vpn/tips';
import useRefreshData from '@/hook/useRefreshData';
import { formatDateTime } from '@/utils/dateTimeFormat';
import axios from 'axios';
import TipsSideBar from '@/app/[locale]/components/sideBar/tipsSideBar';

const Page = () => {
  const router = useRouter();
  const selectedId = useAppSelector(state => state.isVpn.selectedId);
  const msgVpnId = selectedId?.mlsnSn;

  const [data, setData] = useState<any>({});
  const [advanceData, setAdvanceData] = useState<any>({});
  const [selectedTipId, setSelectedTipId] = useState<number>(0);
  const [isEditStatus, setIsEditStatus] = useState<boolean>(false);
  const [hiddenMenu, setHiddenMenu] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(true);
  const { refreshTime, refreshData } = useRefreshData(
    formatDateTime(new Date())
  );

  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => {
    setIsOpen(!isOpen);
    setShowTips(!showTips);
  };

  const handleEditChange = (isEditing: boolean) => {
    setIsEditStatus(true);
  };

  const handleHiddenMenu = () => {
    setHiddenMenu(!hiddenMenu);
  };

  const handleTipsClick = () => {
    setShowTips(!showTips);
    toggle(); // isOpen 상태를 토글
  };

  const handleUpdateData = (updatedData: any) => {
    setAdvanceData(updatedData);
  };

  const fetchData = async () => {
    const baseUrl = `/api/v2/msgVpns/${msgVpnId}`;
    console.log(baseUrl);
    try {
      const response = await axios.get(baseUrl, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const DataVal = response.data.data;
      setData(DataVal);
    } catch (error) {
      console.error('에러:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateData = (newData: any) => {
    setData(newData);
  };

  const patchData = async () => {
    const url = `/api/v2/msgVpns/${msgVpnId}`;

    try {
      const bodyData = {
        ...data,
        ...advanceData
      };
      const response = await axios.patch(url, bodyData, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
      const DataVal = response.data;
      const resCode = DataVal.meta.responseCode;
      console.log(resCode);
      if (resCode === 200) {
        // alert(`successfully edited the ${msgVpns}`);
        alert('Changes Applied Successfully');
        router.push('/mlsnm/settings');
      }
    } catch (error) {
      console.error('에러:', error);
    }
  };

  const handleTipsTitleClick = (id: number) => {
    setSelectedTipId(id);
  };

  const handleApplyClick = () => {
    patchData();
  };
  const handleCancelClick = () => {
    router.push('/mlsnm/settings');
  };

  return (
    <>
      <div className="content__wrap">
        <div className="sol_breadcrumb_area">
          <div className="row d-flex no-gutters position-relative">
            <div className="col-md-6">
              <h3>Edit Message VPN Settings</h3>
            </div>
            <TipsSideBar
              data={VpnTipsData}
              selectedTipId={selectedTipId}
              top={150}
              bottom={20}
            />
            <div
              className="col-md-6 d-flex justify-content-end gap-2 position-absolute"
              style={{ right: 0, top: -7 }}>
              <button
                className="btn btn-outline-light"
                onClick={handleCancelClick}>
                Cancel
              </button>
              <button
                className="btn btn-outline-info"
                onClick={handleApplyClick}>
                Apply
              </button>
            </div>
          </div>
        </div>
        <form className="row mt-2">
          <div className="col-md-12">
            <h5
              onClick={handleHiddenMenu}
              style={{
                cursor: 'pointer'
              }}>
              {hiddenMenu ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
              <div
                className="btn hstack btn-icon btn-outline-light sol_button_btn"
                onClick={handleHiddenMenu}
                style={{ marginLeft: 5 }}>
                <i
                  className={`sol_i_down`}
                  style={{
                    transform: hiddenMenu ? 'none' : 'rotate(180deg)',
                    transition: 'transform 0.3s ease-in-out'
                  }}
                />
              </div>
            </h5>
            <div className="sol_box_p10">
              <Information
                data={data}
                isEditStatus={false}
                onEditChange={handleEditChange}
                onTitleClick={handleTipsTitleClick}
                onUpdateData={updateData}
              />
              <Advenced
                data={data}
                hiddenMenu={hiddenMenu}
                isEditStatus={true}
                onTitleClick={handleTipsTitleClick}
                onUpdateData={handleUpdateData}
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Page;
