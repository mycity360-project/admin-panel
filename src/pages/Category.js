import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import { LocalStorage } from "../shared/lib";
import { http } from "../shared/lib";
import { Image } from "react-bootstrap";
import { Container, Row, Col, Form } from "react-bootstrap";
import moment from "moment/moment";
import { MainContent } from "../components/MainContent";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import * as Yup from "yup";

export default function Category() {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const fields = [
    // name is for formik , initialValues  and all...
    // label is to show input field name on form
    {
      name: "Name",
      label: "Name",
      type: "text",
      validation: Yup.string().required("Name is required"),
      defaultValue: 0,
    },
    {
      name: "Icon",
      label: "Icon",
      type: "file",
      validation: Yup.string().required("Icon is required"),
    },
    {
      name: "Price Limit",
      label: "Price Limit",
      type: "number",
      defaultValue: 0,
      validation: Yup.string().required("Price Limit is required"),
    },
    {
      name: "Price Required",
      label: "Price Required",
      type: "checkbox",
      validation: Yup.string().required("Name is required"),
    },
  ];

  const columns = [
    {
      name: "Sr No.",
      cell: (row, index) => <div>{index + 1}</div>,
    },

    {
      name: "Category",
      selector: (row) => row.name,
    },
    {
      name: "Icon",
      cell: (row) => {
        return <Image src={row.icon} width={40} height={40} />;
      },
    },
    {
      name: "Price Required ",
      cell: (row) => {
        return (
          <Container>
            <Row className="justify-content-center">
              <Col md={6}>
                <Form>
                  <Form.Check
                    type="checkbox"
                    aria-label="Price"
                    checked={row.isPrice}
                    disabled={true}
                  />
                </Form>
              </Col>
            </Row>
          </Container>
        );
      },
      selector: (row) => row.isPrice,
    },
    {
      name: "Created On",
      selector: (row) => moment(row.created_on).format("DD MMM YYYY"),
    },
    {
      name: "Price Limit",
      selector: (row) => row.price_limit,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="text-center">
          <MdModeEditOutline
            color="#444"
            size={20}
            onClick={() => handleEdit()}
            cursor="pointer"
          />
          <MdDelete
            color="#444"
            size={20}
            cursor="pointer"
            style={{ marginLeft: "10px" }}
            onClick={() => handleDelete(row.id)}
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const getCategories = async (page) => {
    try {
      const token = LocalStorage.getData("token");
      const categoriesRespData = await http.get(
        `category/?page=${page}&page_size=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const categories = categoriesRespData.results.map((category) => ({
        id: category.id.toString(),
        name: category.name,
        icon: category.icon,
        seq: category.sequence,
        isPrice: category.is_price,
        created_on: category.created_date,
        price_limit: category.price_limit,
      }));

      setTotalRows(categoriesRespData.count);
      setData(categories);
    } catch (error) {
      console.log(JSON.stringify(error), 25);
    } finally {
      //   setLoading(false);
    }
  };

  useEffect(() => {
    getCategories(1);
  }, [perPage]);

  const deleteCategory = async (id) => {
    try {
      const token = LocalStorage.getData("token");
      const respData = await http.delete(`category/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error, "165");
    }
  };

  const handlePageChange = async (page) => {
    await getCategories(page);
  };

  const handlePerRowsChange = async (newPerPage) => {
    setPerPage(newPerPage);
  };

  const handleEdit = () => {
    console.log("edit");
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete it ?");
    if (shouldDelete) {
      await deleteCategory(id);
    }
  };

  const handleToggleModal = () => {
    setShowForm(!showForm);
  };

  return (
    <div>
      <NavigationBar />
      <div className="d-flex">
        <SidebarMenu />
        <MainContent
          title="Category"
          data={data}
          columns={columns}
          totalRows={totalRows}
          handlePageChange={handlePageChange}
          handlePerRowsChange={handlePerRowsChange}
          handleDelete={handleDelete}
          handleToggleModal={handleToggleModal}
          showForm={showForm}
          fields={fields}
          modalHeading={"Add Category"}
        />
      </div>
    </div>
  );
}
