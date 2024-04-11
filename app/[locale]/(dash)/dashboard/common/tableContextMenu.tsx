import { Menu, MenuItem } from "@mui/material";

export default function TableContextMenu(props: any) {
  const { options, handleClose, anchorPosition } = props;

  return (
    <Menu
      id="long-menu"
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition} // Use the saved anchorPosition instead of anchorEl
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      keepMounted
      open={!!anchorPosition}
      onClose={handleClose}
      sx={{
        "& .MuiMenu-paper": {
          backgroundColor: "#2f3032",
          padding: "0px",
          opacity: 1,
          color: "#e1e7f0",
          border: "1px solid #9b9fa7",
        },
      }}
      MenuListProps={{ sx: { padding: "0" } }}
    >
      {options.map((option: any) => (
        <MenuItem
          onClick={(event) => {
            option.handler(props?.data);
            handleClose();
            event.stopPropagation();
          }}
          key={option.name}
          // selected={option.name === RES_MENU_GOTO_QUEUE}
          className="table-context-menu-item"
        >
          {option.name}
        </MenuItem>
      ))}
    </Menu>
  );
}
