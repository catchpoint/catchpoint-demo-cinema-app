import { TableCell } from "@mui/material";
import React from "react";

const CustomTableCell = ({ sx, props, children }) => {
  return (
    <TableCell
      sx={{ color: "#fff", backgroundColor: "#051d32", ...sx }}
      align="left"
      {...props}
    >
      {children ?? "N/A"}
    </TableCell>
  );
};

export default CustomTableCell;
