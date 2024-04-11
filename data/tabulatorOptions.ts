export const options = {
  // layout: "fitColumns",
  placeholder: "데이터가 없습니다",
  // headerVisible: false,
  layout: "fitColumns",
  printAsHtml: true,
  printVisibleRowsOnly: true,
  movableColumns: true,
  // maxHeight: 250,
  height: 250,
  pagination: true,
  // paginationSize: 2,
  paginationSizeSelector: [10, 20, 50, 100],
};

export const options2 = {
  layout: "fitColumns",
  placeholder: "데이터가 없습니다",
};

export const options3 = {
  layout: "fitColumns",
  placeholder: "데이터가 없습니다",
  pagination: "local",
  paginationSize: 10,
  // 이걸 해줘야함
  paginationElement: document.getElementById("table-pagination"),
  paginationAddRow: "table",
  paginationSizeSelector: [5, 10, 20, 50],
  paginationButtonCount: 5,
};
