import React, { useEffect, useState } from "react";
import CustomTableCell from "../CustomTableCell";
import { getLogs } from "../../../api/logs";
import {
  Pagination,
  PaginationItem,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const LOG_PER_PAGE = 20;

const SqlLogs = () => {
  const [sqlLogs, setSqlLogs] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchSqlLogs = async () => {
      const res = await getLogs();
      setSqlLogs(res);
    };
    fetchSqlLogs();

    return () => {
      setSqlLogs([]);
    }

  }, []);

  return (
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 2, backgroundColor: "#051d32", maxHeight: "100%" }}
    >
      <Table sx={{ minWidth: 700 }} stickyHeader>
        <TableHead>
          <TableRow>
            <CustomTableCell>
              <b>Count</b>
            </CustomTableCell>
            <CustomTableCell>
              <b>SQL Query</b>
            </CustomTableCell>
            <CustomTableCell>
              <b>Parameters</b>
            </CustomTableCell>
            <CustomTableCell sortDirection={"desc"}>
              <b>Time</b>
            </CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ overflow: "scroll" }}>
          {sqlLogs
            ?.sort((a, b) => b.timestamp - a.timestamp)
            .slice((page - 1) * LOG_PER_PAGE, page * LOG_PER_PAGE)
            .map((row) => (
              <TableRow key={row.name} sx={{ border: "none" }} hover={true}>
                <CustomTableCell component="th" scope="row">
                  {row.count}
                </CustomTableCell>
                <CustomTableCell component="th" scope="row">
                  {row.sql}
                </CustomTableCell>
                <CustomTableCell component="th" scope="row">
                  {row.params.join(", ")}
                </CustomTableCell>
                <CustomTableCell component="th" scope="row">
                  {new Date(row.timestamp).toLocaleString()}
                </CustomTableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Pagination
        count={Math.ceil(sqlLogs.length / LOG_PER_PAGE)}
        color="primary"
        size="large"
        onChange={(e, value) => setPage(value)}
        renderItem={(item) => (
          <PaginationItem
            component="button"
            sx={{
              color: "white",
              backgroundColor: "#051d32",
              "&:hover": {
                backgroundColor: "#051d32",
              },
            }}
            {...item}
          />
        )}
      />
    </TableContainer>
  );
};

export default SqlLogs;
