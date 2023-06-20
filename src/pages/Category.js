import React, { useCallback, useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import { LocalStorage } from "../shared/lib";
import { http } from "../shared/lib";
import { Image } from "react-bootstrap";
import moment from "moment/moment";
import { MainContent } from "../components/MainContent";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { Checkbox } from "../components/checkbox";

export default function Category() {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [isFormEditCategory, setIsFormEditCategory] = useState(false);
  const [editFormFields, setEditFormFields] = useState([]);
  const [categoryIdSelectedForEdit, setCategoryIdSelectedForEdit] =
    useState("");

  const formFields = [
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "icon",
      label: "Icon",
      type: "file",
    },
    {
      name: "price_limit",
      label: "Price Limit",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "is_price",
      label: "Is Price Required",
      type: "checkbox",
      defaultValue: true,
    },
    {
      name: "phone",
      label: "Phone",
      type: "number",
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
            onClick={() => {
              setModalHeading("Edit Category");
              setIsFormEditCategory(true);
              handleEditFormFields(row);
              handleToggleModal();
            }}
            cursor="pointer"
          />
          <MdDelete
            color="#444"
            size={20}
            cursor="pointer"
            onMouseEnter={(e) => {
              e.target.style.color = "red";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#444";
            }}
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

  const getCategories = useCallback(
    async (page) => {
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
          id: category.id,
          name: category.name,
          icon: category.icon,
          seq: category.sequence,
          is_price: category.is_price,
          created_on: category.created_date,
          price_limit: category.price_limit,
          phone: category.phone,
        }));

        setTotalRows(categoriesRespData.count);
        setData(categories);
      } catch (error) {
        console.log(JSON.stringify(error), 25);
      } finally {
        //   setLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    getCategories(1);
  }, [getCategories]);

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

  const handleToggleModal = () => {
    setShowForm(!showForm);
    isFormEditCategory && setIsFormEditCategory(false);
  };

  const uploadIcon = async (file, id) => {
    try {
      const iconData = new FormData();

      iconData.append("file", file);

      const token = LocalStorage.getData("token");

      const url = `category/icon/${id}/`;
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const resp = await http.post(url, iconData, config);
      console.log(resp, "199");
    } catch (error) {
      console.log(error, "201");
    }
  };

  const createCategory = async (values) => {
    try {
      const token = LocalStorage.getData("token");
      const url = "category/";
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
        },
      };
      const data = {
        name: values.name,
        phone: values.phone,
        is_price: values.is_price_required,
        price_limit: values.price_limit,
      };
      const resp = await http.post(url, data, config);
      console.log(resp);
      return resp;
    } catch (error) {
      console.log(error, "223");
    }
  };

  const updateCategory = async (values) => {
    try {
      console.log(categoryIdSelectedForEdit);
      const token = LocalStorage.getData("token");
      const url = `category/${categoryIdSelectedForEdit}/`;
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
        },
      };

      const data = {
        name: values.name,
        phone: values.phone,
        is_price: values.is_price,
        price_limit: values.price_limit,
      };
      console.log(data, "api");
      const resp = await http.put(url, data, config);
      console.log(resp);
    } catch (error) {
      console.log(error, "223");
    }
  };

  const handleAdd = async (event, values) => {
    event.preventDefault();
    console.log("hi", values);
    const resp = await createCategory(values);
    resp && (await uploadIcon(values.icon, resp.id));
    setShowForm(false);
    setModalHeading("");
  };

  const handleEdit = async (event, values) => {
    event.preventDefault();
    console.log("edit", values);
    await updateCategory(values);
    await uploadIcon(values.icon, categoryIdSelectedForEdit);
    setShowForm(false);
    setModalHeading("");
    setCategoryIdSelectedForEdit("");
  };

  const handleEditFormFields = (rowData) => {
    const fields = formFields.map((field) => {
      return {
        ...field,
        defaultValue: rowData[field.name],
      };
    });
    console.log(rowData, fields);
    setCategoryIdSelectedForEdit(rowData.id);
    setEditFormFields(fields);
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete it ?");
    if (shouldDelete) {
      await deleteCategory(id);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div className="d-flex">
        <SidebarMenu />
        <MainContent
          title="Category"
          modalHeading={modalHeading}
          data={data}
          columns={columns}
          totalRows={totalRows}
          handlePageChange={handlePageChange}
          handlePerRowsChange={handlePerRowsChange}
          handleDelete={handleDelete}
          handleToggleModal={handleToggleModal}
          setModalHeading={setModalHeading}
          showForm={showForm}
          formFields={isFormEditCategory ? editFormFields : formFields}
          formSubmitHandler={isFormEditCategory ? handleEdit : handleAdd}
          isRemote={true}
          isAddFormVisible={true}
          isFormEditCategory={isFormEditCategory}
        />
      </div>
    </div>
  );
}
