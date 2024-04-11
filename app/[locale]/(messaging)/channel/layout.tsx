'use client';

import { useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector } from '@/hook/hook';
import ChangeQueue from '@/app/[locale]/components/changeModal/changeQueue';

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
    { id: 0, title: 'Summary', contentUrl: '/channel', disableGbn: true },
    {
      id: 1,
      title: 'Settings',
      contentUrl: '/channel/settings',
      disableGbn: true
    },
    { id: 2, title: 'Subscriptions', contentUrl: '', disableGbn: false },
    { id: 3, title: 'Consumers', contentUrl: '', disableGbn: false },
    { id: 4, title: 'Messages Queued', contentUrl: '', disableGbn: false },
    { id: 5, title: 'Stats', contentUrl: '', disableGbn: false }
  ];

  const fnMovePage = (url: string, id: number) => {
    console.log(url);
    setIndex(id);
    router.push(url);
  };

  const fnQueueEdit = () => {
    console.log('edit');
    router.push('/channel/settings/edit');
  };

  return (
    <>
      <div>
        {pathname === '/channel/settings/edit' ? (
          <div className="content__wrap">{props.tabs}</div>
        ) : (
          <>
            <div className="content__wrap sol_content_pb50">
              <div className="sol_breadcrumb_area">
                <div className="row">
                  <div className="row d-flex col-md-8">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item">{selectedId?.msnId}</li>
                        <li className="breadcrumb-item">
                          <a href="/mlsnList">{selectedVpn?.msgVpnName}</a>
                        </li>
                        <li className="breadcrumb-item">
                          <a href="/channelList">Queues</a>
                        </li>
                        <li
                          className="breadcrumb-item active"
                          aria-current="page">
                          {selectedQueue?.queueName}
                        </li>
                      </ol>
                    </nav>
                  </div>
                  <div className="col-md-4 d-flex justify-content-end position-relative">
                    <div
                      className="btn-group position-absolute"
                      style={{ right: '-10px', top: '-7px' }}>
                      <ChangeQueue />
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-base">
                <div className="position-relative">
                  <ul className="nav nav-callout" role="tablist">
                    {data.map(item => (
                      <li
                        className="nav-item"
                        role="presentation"
                        key={item.id}>
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
                    {pathname === '/channel/settings' ? (
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => fnQueueEdit()}>
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
          </>
        )}
      </div>

      {/* <div className="sol_breadcrumb_area">
        <div className="row">
          <nav aria-label="breadcrumb" className="col-md-8">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><a href="/mlsnList">{selectedVpn?.msgVpnName}</a></li>
              <li className="breadcrumb-item"><a href="/channelList">Queues</a></li>
              <li className="breadcrumb-item active" aria-current="page">{selectedQueue?.queueName}</li>
            </ol>
          </nav>
          <div className="col-md-4 text-end sol_nav_rigbtn_area gap-2">
            <button className="btn btn-outline-warning">Change Queue</button>
            {pathname === '/channel/settings' ?
              <button className="btn btn-outline-light" onClick={() => fnQueueEdit()}>Edit</button>
              : null
            }
          </div>
        </div>
      </div> */}
    </>
  );
}
