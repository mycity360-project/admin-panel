import React from "react";
import { Button, Container } from "react-bootstrap";
import DataTable from "react-data-table-component";

export const MainContent = ({
  data,
  columns,
  totalRows,
  handlePageChange,
  handlePerRowsChange,
  handleAdd,
}) => {
  return (
    <Container className="main-content main-style">
      <Button title="Add" onClick={() => handleAdd()} />
      <DataTable
        data={data}
        columns={columns}
        dense
        striped
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        customStyles={{
          headCells: {
            style: {
              whiteSpace: "normal",
              wordBreak: "break-word",
            },
          },
        }}
      />
    </Container>
  );
};
