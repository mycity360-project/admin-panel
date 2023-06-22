import React, { useCallback, useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import { LocalStorage } from "../shared/lib";
import { http } from "../shared/lib";
import moment from "moment/moment";
import { MainContent } from "../components/MainContent";
import { MdModeEditOutline, MdDelete } from "react-icons/md";

export default function SubCategory() {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [modalHeading, setModalHeading] = useState("");
  const [isFormEditCategory, setIsFormEditCategory] = useState(false);
  const [editFormFields, setEditFormFields] = useState([]);
  const [subCategoryIdSelectedForEdit, setSubCategoryIdSelectedForEdit] =
    useState("");
  //   const [loading, setLoading] = useState(false);

  const formFields = [
    {
      name: "category",
      label: "Category",
      type: "dropdown",
      options: categories,
    },
    { name: "name", label: "Name", type: "text" },
    {
      name: "sequence",
      label: "Sequence",
      type: "number",
    },
    {
      name: "is_active",
      label: "Is Active",
      type: "checkbox",
    },
  ];

  const columns = [
    {
      name: "Sr No.",
      cell: (row, index) => (
        <div>{(currentPage - 1) * perPage + (index + 1)}</div>
      ),
    },

    {
      name: "Sub-category",
      selector: (row) => row.name,
    },
    {
      name: "Category",
      selector: (row) => row.category.name,
    },
    {
      name: "Sequence",
      selector: (row) => row.sequence,
    },
    {
      name: "Created On",
      selector: (row) => moment(row.created_date).format("DD MMM YYYY"),

      compact: true,
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

  const getSubCategories = useCallback(
    async (page) => {
      // setLoading(true);

      try {
        const token = LocalStorage.getData("token");
        const categoriesRespData = await http.get(
          `sub-category/?page=${page}&page_size=${perPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(categoriesRespData.results);
        setTotalRows(categoriesRespData.count);
        setData(categoriesRespData.results);
      } catch (error) {
        console.log(JSON.stringify(error), 25);
      } finally {
        //   setLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    getSubCategories(1);
  }, [getSubCategories]);

  const getCategories = async () => {
    try {
      const token = LocalStorage.getData("token");
      const categoriesRespData = await http.get(
        `category/?page=1&page_size=100`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const categories = categoriesRespData.results.map((category) => ({
        id: category.id,
        name: category.name,
      }));
      setCategories(categories);
    } catch (error) {
      console.log(error, "145");
    } finally {
      //   setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const deleteSubCategory = async (id) => {
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
    await getSubCategories(page);
  };

  const handlePerRowsChange = async (newPerPage) => {
    setPerPage(newPerPage);
  };

  const handleToggleModal = () => {
    setShowForm(!showForm);
    isFormEditCategory && setIsFormEditCategory(false);
  };

  const createSubCategory = async (values) => {
    try {
      const token = LocalStorage.getData("token");
      const url = "category/";
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
        },
      };

      const data = {
        category_id: values.category,
        name: values.name,
        sequence: values.sequence,
        is_active: values.is_active,
      };

      const resp = await http.post(url, data, config);

      return resp;
    } catch (error) {
      console.log(error, "223");
    }
  };

  const updateSubCategory = async (SubCategoryData) => {
    try {
      const token = LocalStorage.getData("token");
      const url = `category/${subCategoryIdSelectedForEdit}/`;
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
        },
      };

      const data = {
        category_id: SubCategoryData.category.id,
        name: SubCategoryData.name,
        sequence: SubCategoryData.sequence,
        is_active: SubCategoryData.is_active,
      };

      const resp = await http.put(url, data, config);

      return resp;
    } catch (error) {
      console.log(error, "223");
    }
  };

  const handleAdd = async (event, values) => {
    event.preventDefault();
    console.log("hi", values);
    await createSubCategory(values);
    setShowForm(false);
    setModalHeading("");
  };

  const handleEdit = async (event, values) => {
    event.preventDefault();
    console.log("hi", values);
    await updateSubCategory(values);
    setShowForm(false);
    setModalHeading("");
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete it ?");
    if (shouldDelete) {
      await deleteSubCategory(id);
    }
  };

  const handleEditFormFields = (rowData) => {
    const fields = formFields.map((field) => {
      return {
        ...field,
        defaultValue: rowData[field.name],
      };
    });
    console.log(rowData, fields);
    setSubCategoryIdSelectedForEdit(rowData.id);
    setEditFormFields(fields);
  };
  return (
    <div>
      <NavigationBar />
      <div className="d-flex">
        <SidebarMenu />
        <MainContent
          title="Sub Category"
          modalHeading={modalHeading}
          data={data}
          columns={columns}
          totalRows={totalRows}
          handlePageChange={handlePageChange}
          handlePerRowsChange={handlePerRowsChange}
          handleDelete={handleDelete}
          handleToggleModal={handleToggleModal}
          isRemote={true}
          isAddFormVisible={true}
          showForm={showForm}
          formFields={isFormEditCategory ? editFormFields : formFields}
          setModalHeading={setModalHeading}
          formSubmitHandler={isFormEditCategory ? handleEdit : handleAdd}
          isFormEditCategory={isFormEditCategory}
        />
      </div>
    </div>
  );
}
