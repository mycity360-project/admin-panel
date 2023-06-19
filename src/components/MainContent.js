import React from "react";
import { Button, Container } from "react-bootstrap";
import DataTable from "react-data-table-component";
import FormModal from "./FormModal";
import FormDropdownModal from "./FormDropDownModal";
export const MainContent = ({
  title,
  data,
  columns,
  isRemote,
  totalRows,
  handlePageChange,
  handlePerRowsChange,
  handleToggleModal,
  setModalHeading,
  showForm,
  fields,
  modalHeading,
  formSubmitHandler,
  isAddFormVisible,
  isFormEditCategory,
  isFromQuestion,
  isFormReqDropdown,
  formFields,
  handleSecondDropdownData,
}) => {
  return (
    <Container className="main-content main-style">
      {isAddFormVisible && (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setModalHeading(`Add ${title}`);
                handleToggleModal();
              }}
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
      {!isFormReqDropdown && showForm && (
        <FormModal
          show={showForm}
          onHide={() => handleToggleModal()}
          modalHeading={modalHeading}
          isFormEditCategory={isFormEditCategory}
          formSubmitHandler={formSubmitHandler}
        />
      )}
      {isFormReqDropdown && showForm && (
        <FormDropdownModal
          show={showForm}
          onHide={() => handleToggleModal()}
          fields={fields}
          modalHeading={modalHeading}
          isFormEditCategory={isFormEditCategory}
          formSubmitHandler={formSubmitHandler}
          formFields={formFields}
          isFromQuestion={isFromQuestion}
          handleSecondDropdownData={handleSecondDropdownData}
        />
      )}
    </Container>
  );
};
