"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppSelector } from "@/hook/hook";

export default function Layout(props: { tabs: ReactNode }) {
  const [index, setIndex] = useState(0);

  const router = useRouter();
  const pathname = usePathname();

  const selectedVpn = useAppSelector((state) => state.isVpn.selectedRow);
  console.log(selectedVpn);

  const selectedId = useAppSelector((state) => state.isVpn.selectedMsnId);

  const selectedQueue = useAppSelector((state) => state.queue.selectedQueue);
  console.log(selectedQueue);

  const activeLink = (id: number, contentUrl: string, disableGbn: boolean) => {
    if (disableGbn) {
      return contentUrl === pathname ? "nav-link active" : "nav-link";
    } else {
      return "nav-link disabled";
    }
  };

  const data = [
    { id: 0, title: "Queues", contentUrl: "/channelList", disableGbn: true },
    { id: 1, title: "Topic Endpoints", contentUrl: "", disableGbn: false },
    { id: 2, title: "Templates", contentUrl: "", disableGbn: false },
  ];

  const fnMovePage = (url: string, id: number) => {
    console.log(url);
    setIndex(id);
    router.push(url);
  };

  return (
    <>
      <div className="content__wrap sol_content_pb50">
        <div className="sol_breadcrumb_area">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">{selectedId?.msnId}</li>
              <li className="breadcrumb-item">{selectedVpn?.msgVpnName}</li>
              <li className="breadcrumb-item active" aria-current="page">
                Queues
              </li>
            </ol>
          </nav>
        </div>

        <div className="tab-base">
          <ul className="nav nav-callout" role="tablist">
            {data.map((item) => (
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
                  onClick={() => fnMovePage(item.contentUrl, item.id)}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
          {data
            .filter((item) => index === item.id)
            .map((item) => (
              <div key={item.id}>{props.tabs}</div>
            ))}
        </div>
      </div>
    </>
  );
}
