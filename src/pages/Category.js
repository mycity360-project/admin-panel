import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import { LocalStorage } from "../shared/lib";
import { http } from "../shared/lib";
import { Image } from "react-bootstrap";
import moment from "moment/moment";
import { MainContent } from "../components/MainContent";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import * as Yup from "yup";
import { Checkbox } from "../components/checkbox";

export default function Category() {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const fields = [
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
      name: "Is Price Required",
      label: "Is Price Required",
      type: "checkbox",
      validation: Yup.string().required("Price is required"),
    },
    {
      name: "Phone",
      label: "Phone",
      type: "text",
      validation: Yup.string().required("Phone is required"),
    },
  ];

  const columns = [
    {
      name: "Sr No.",
      cell: (row, index) => {
        return <div> {(currentPage - 1) * perPage + (index + 1)}</div>;
      },
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
      name: "Price\nRequired ",
      cell: (row) => <Checkbox value={row.isPrice} isDisabled={true} />,
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
      await http.delete(`category/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error, "165");
    }
  };

  const handlePageChange = async (page) => {
    setCurrentPage(page);
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

  const handleFormSubmit = (event, val) => {
    event.preventDefault();
    console.log(event);
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
          handleFormSubmit={handleFormSubmit}
        />
      </div>
    </div>
  );
}
