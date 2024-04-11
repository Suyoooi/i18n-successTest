'use client';

import { useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/hook/hook';
import ChangeVpn from '@/app/[locale]/components/changeModal/changeVpn';

export default function Layout(props: {
  tabs: ReactNode;
  children: ReactNode;
}) {
  const [index, setIndex] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  const selectedVpn = useAppSelector(state => state.isVpn.selectedRow);
  console.log(selectedVpn);
  const selectedId = useAppSelector(state => state.isVpn.selectedMsnId);

  const selectedQueue = useAppSelector(state => state.queue.selectedQueue);
  console.log(selectedQueue);

  const activeLink = (id: number, contentUrl: string, disableGbn: boolean) => {
    if (disableGbn) {
      return contentUrl === pathname ? 'nav-link active' : 'nav-link';
    } else {
      return 'nav-link disabled';
    }
  };

  const data = [
    { id: 0, title: 'Summary', contentUrl: '/mlsnm', disableGbn: true },
    {
      id: 1,
      title: 'Settings',
      contentUrl: '/mlsnm/settings',
      disableGbn: true
    },
    { id: 2, title: 'Services', contentUrl: '', disableGbn: false },
    { id: 3, title: 'Replication', contentUrl: '', disableGbn: false },
    { id: 4, title: 'Proxies', contentUrl: '', disableGbn: false },
    { id: 5, title: 'Stats', contentUrl: '', disableGbn: false }
  ];
  const handleEditClick = () => {
    router.push('/edit/mlsnm/settings');
  };

  const fnMovePage = (url: string, id: number) => {
    console.log(url);
    setIndex(id);
    router.push(url);
  };

  return (
    <>
      <div>
        <div className="content__wrap">
          <div className="sol_breadcrumb_area">
            <div className="row">
              <div className="row d-flex col-md-8">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">{selectedId?.msnId}</li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {selectedVpn?.msgVpnName}
                    </li>
                  </ol>
                </nav>
              </div>
              <div className="col-md-4 d-flex justify-content-end position-relative">
                <div
                  className="btn-group position-absolute"
                  style={{ right: '-10px', top: '-7px' }}>
                  <ChangeVpn />
                </div>
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
              <div className="position-absolute sol_tab_rigbtn">
                {pathname === '/mlsnm/settings' ? (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleEditClick}>
                    Edit
                  </button>
                ) : null}
              </div>
            </div>
            {data
              .filter(item => index === item.id)
              .map(item => (
                <div key={item.id}>{props.tabs}</div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
