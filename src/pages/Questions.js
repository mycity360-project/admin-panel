import React, { useCallback, useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import { LocalStorage } from "../shared/lib";
import { http } from "../shared/lib";
import moment from "moment/moment";
import { MainContent } from "../components/MainContent";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { Checkbox } from "../components/checkbox";

export default function Questions() {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [isFormEditCategory, setIsFormEditCategory] = useState(false);
  const [editFormFields, setEditFormFields] = useState([]);
  const formFields = [
    {
      name: "category",
      label: "Category",
      type: "dropdown",
      options: categories,
    },
    {
      name: "question",
      label: "Question",
      type: "text",
    },
  ];
  const [addFormFields, setAddFormFields] = useState([]);

  const columns = [
    {
      name: "Sr No.",
      cell: (row, index) => (
        <div>{(currentPage - 1) * perPage + (index + 1)}</div>
      ),
    },
    {
      name: "question",
      selector: (row) => row.question,
    },
    {
      name: "Feild Type",
      selector: (row) => row.field_type,
    },
    {
      name: "Required",
      cell: (row) => <Checkbox value={row.is_required} isDisabled={true} />,
      selector: (row) => row.is_required,
    },
    {
      name: "Created On",
      selector: (row) => moment(row.created_on).format("DD MMM YYYY"),
      compact: true,
    },
    {
      name: "Category/Sub-category",
      selector: (row) => row.category.id,
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

  const getQuestions = useCallback(
    async (page) => {
      // setLoading(true);

      try {
        const token = LocalStorage.getData("token");
        const questionResp = await http.get(
          `question/?page=${page}&page_size=${perPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTotalRows(questionResp.count);
        setData(questionResp.results);
      } catch (error) {
        console.log(JSON.stringify(error), 25);
      } finally {
        //   setLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    getQuestions(1);
  }, [getQuestions]);

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
      let fields = [...formFields];
      fields.splice(0, 1, {
        name: "category",
        label: "Category",
        type: "dropdown",
        options: categories,
      });

      setAddFormFields(fields);
    } catch (error) {
      console.log(error, "145");
    } finally {
      //   setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const getSubCategories = async (id) => {
    try {
      const token = LocalStorage.getData("token");
      const categoriesRespData = await http.get(
        `sub-category/?category_id=${id}&page_size=500`,
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
      setSubCategories(categories);
    } catch (error) {
      console.log(JSON.stringify(error), 25);
    } finally {
      //   setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const token = LocalStorage.getData("token");
      await http.delete(`question/${id}/`, {
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
    await getQuestions(page);
  };

  const handlePerRowsChange = async (newPerPage) => {
    setPerPage(newPerPage);
  };
  const handleToggleModal = () => {
    setShowForm(!showForm);
    isFormEditCategory && setIsFormEditCategory(false);
  };

  const handleAdd = async (event, values) => {
    event.preventDefault();
    console.log("hi", values);
    setShowForm(false);
    setModalHeading("");
  };

  const handleEdit = (event, values) => {
    event.preventDefault();
    console.log("edit", values);
  };

  const handleEditFormFields = (rowData) => {
    const fields = formFields.map((field) => {
      return {
        ...field,
        defaultValue: rowData[field.name],
      };
    });
    console.log(rowData, fields);
    setEditFormFields(fields);
  };

  const addSecondDropdown = () => {
    let fields = [...formFields];
    fields.splice(1, 0, {
      name: "subcategory",
      label: "Sub Category",
      type: "dropdown",
      options: subCategories,
    });
    setAddFormFields(fields);
  };

  const handleSecondDropdown = async (id) => {
    await getSubCategories(id);
    console.log(subCategories);
    addSecondDropdown();

    // console.log(fields);
    // setFormFields(fields);
  };

  const handleDelete = async (id) => {
    await deleteCategory(id);
  };

  return (
    <div>
      <NavigationBar />
      <div className="d-flex">
        <SidebarMenu />
        <MainContent
          title="Question"
          modalHeading={modalHeading}
          data={data}
          columns={columns}
          totalRows={totalRows}
          handlePageChange={handlePageChange}
          handlePerRowsChange={handlePerRowsChange}
          handleAdd={handleAdd}
          handleDelete={handleDelete}
          isRemote={true}
          handleToggleModal={handleToggleModal}
          setModalHeading={setModalHeading}
          showForm={showForm}
          fields={isFormEditCategory ? editFormFields : addFormFields}
          formSubmitHandler={isFormEditCategory ? handleEdit : handleAdd}
          isAddFormVisible={true}
          isFormEditCategory={isFormEditCategory}
          isSecondDropdown={true}
          handleSecondDropdown={handleSecondDropdown}
        />
      </div>
    </div>
  );
}
