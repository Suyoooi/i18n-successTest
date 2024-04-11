import React from "react";
import { render } from "react-dom";

export function reactFormatter(JSX: any) {
  return function customFormatter(cell: any, formatterParams: any, onRendered: (callback: () => void) => void) {
    // cell - the cell component
    // formatterParams - parameters set for the column
    // onRendered - function to call when the formatter has been rendered
    const renderFn = () => {
      const cellEl = cell.getElement();
      if (cellEl) {
        const formatterCell = cellEl.querySelector('.formatterCell');
        if (formatterCell) {
          const CompWithMoreProps = React.cloneElement(JSX, { cell });
          render(CompWithMoreProps, cellEl.querySelector('.formatterCell'));
        }
      }
    };

    onRendered(renderFn); // initial render only.

    setTimeout(() => {
      renderFn(); // render every time cell value changed.
    }, 0);
    return '<div class="formatterCell"></div>';
  };
}