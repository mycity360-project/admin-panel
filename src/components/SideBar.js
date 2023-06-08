import React, { useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { items } from "../shared/constants/sidebarItems";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import Category from "../pages/Category";

const Sidebar = ({
  title,
  data,
  columns,
  handlePageChange,
  handlePerRowsChange,
  totalRows,
  contextActions,
  onSelectedRowsChange,
  clearSelectedRows,
  selectable,
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ height: "92vh", marginTop: 150 }}>
      <Container fluid className="h-100">
        <Row className="h-100">
          <Col
            md={2}
            className="bg-dark text-light d-flex flex-column"
            style={{ paddingTop: 10 }}
          >
            {/* Sidebar content */}
            <ul>
              {items.map((item, index) => (
                <li key={index} style={{ cursor: "pointer" }}>
                  <Link to={`/home/${item.item}`}>{item.item}</Link>
                </li>
              ))}
            </ul>
          </Col>
          <Col md={9} className="d-flex flex-column">
            {/* Main content */}
            <div className="flex-grow-1">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <DataTable
                  title={title}
                  columns={columns}
                  data={data}
                  keyField="id"
                  progressPending={loading}
                  pagination
                  paginationServer
                  paginationTotalRows={totalRows}
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                  selectableRows={selectable}
                  contextActions={contextActions}
                  onSelectedRowsChange={onSelectedRowsChange}
                  clearSelectedRows={clearSelectedRows}
                />
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Sidebar;
