'use client';

import RefreshData from '@/app/[locale]/components/footer/refreshData';
import { useAppSelector } from '@/hook/hook';
import useRefreshData from '@/hook/useRefreshData';
import { formatDateTime } from '@/utils/dateTimeFormat';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Advenced from '../common/settings/advenced';
import Information from '../common/settings/information';
import { VpnTipsData } from '@/data/vpn/tips';
import { useRouter } from 'next/navigation';
import { SETTING_DATA } from '@/data/gridData';
import TipsSideBar from '@/app/[locale]/components/sideBar/tipsSideBar';

export default function Page() {
  const router = useRouter();

  const selectedRow = useAppSelector(state => state.isVpn.selectedRow);
  const selectedId = useAppSelector(state => state.isVpn.selectedId);

  const msgVpns = selectedRow?.msgVpnName;
  const msgVpnId = selectedId?.mlsnSn;

  const [data, setData] = useState<any>({});
  const [selectedTipId, setSelectedTipId] = useState<number>(0);
  const [isEditStatus, setIsEditStatus] = useState<boolean>(false);
  const [hiddenMenu, setHiddenMenu] = useState<boolean>(false);
  const [showTips, setShowTips] = useState<boolean>(true);

  const { refreshTime, refreshData } = useRefreshData(
    formatDateTime(new Date())
  );

  const handleEditChange = (isEditing: boolean) => {
    setIsEditStatus(!isEditing);
  };

  const handleEditClick = () => {
    router.push('/edit/mlsnm/settings');
  };

  const handleHiddenMenu = () => {
    setHiddenMenu(!hiddenMenu);
  };

  const handleTipsClick = () => {
    console.log('tips Click', showTips);
    setShowTips(!showTips);
  };

  const handleUpdateData = (updatedData: any) => {
    console.log('데이터 받음:::', updatedData);
  };

  const updateData = (newData: any) => {
    console.log(newData);
    setData(newData);
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
      const resCode = response.data.meta.responseCode;
      console.log('codeeeee', resCode);
      if (resCode === 200) {
        const DataVal = response.data.data;
        setData(DataVal);
        // } else if (resCode === 400) {
        //   console.log('aaaa')
        //   setData(SETTING_DATA);
      }
    } catch (error: any) {
      console.error('에러:', error);
      const metaInfo = error.response.data.meta;

      if (metaInfo && metaInfo != null) {
        const errCd = metaInfo.responseCode;
        const errId = metaInfo.error.code;
        const errMsg = metaInfo.error.description;
        if (errCd && errCd === 400) {
          if (errId && errId === 11) {
            const splitVal = errMsg.split(': ');
            // alert(splitVal[1]);
            setData(SETTING_DATA);
          } else {
            console.log(error);
          }
        } else {
          console.log(error);
        }
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedRow, refreshTime, selectedId]);

  const handleTipsTitleClick = (id: number) => {
    console.log(id);
    setSelectedTipId(id);
  };

  return (
    <>
      {/* <label
        style={{
          display: "flex",
          gap: 3,
          marginTop: 20,
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={handleEditClick}
          className={`btn btn-outline-light ${isEditStatus ? "active" : ""}`}
        >
          Edit
        </button>
      </label> */}
      <div className="tab-content">
        <form className="row">
          <div className={`col-md-${showTips ? '12' : '12'}`}>
            <TipsSideBar
              data={VpnTipsData}
              selectedTipId={selectedTipId}
              top={200}
              bottom={80}
            />

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
                isEditStatus={!isEditStatus}
                onEditChange={handleEditChange}
                onTitleClick={handleTipsTitleClick}
                onUpdateData={updateData}
              />
              <Advenced
                data={data}
                hiddenMenu={hiddenMenu}
                isEditStatus={!isEditStatus}
                onTitleClick={handleTipsTitleClick}
                onUpdateData={handleUpdateData}
              />
            </div>
          </div>
          {/* Tips */}
        </form>
        {/* footer */}
        <div className="sol_footer_pagenation fixed-bottom">
          <div className="col d-flex justify-content-end">
            <RefreshData
              onRefreshClick={refreshData}
              refreshTime={refreshTime}
            />
          </div>
        </div>
      </div>
    </>
  );
}
