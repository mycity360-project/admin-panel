import React from "react";
import { Button, Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import FormModal from "./FormModal";
export const MainContent = ({
  data,
  columns,
  isRemote,
  totalRows,
  handlePageChange,
  handlePerRowsChange,
  handleToggleModal,
  showForm,
  fields,
  modalHeading,
  handleAddCategory,
  isAddFormVisisble,
}) => {
  return (
    <Container className="main-content main-style">
      {isAddFormVisisble && (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleToggleModal()}
            >
              Add
            </Button>
          </div>
        </div>
      )}

      <DataTable
        data={data}
        columns={columns}
        dense={true}
        striped={true}
        pagination
        paginationServer={isRemote}
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
        paginationRowsPerPageOptions={[10, 15]}
      />
      {showForm && (
        <FormModal
          show={showForm}
          onHide={() => handleToggleModal()}
          fields={fields}
          modalHeading={modalHeading}
          handleAddCategory={handleAddCategory}
        />
      )}
    </Container>
  );
};
