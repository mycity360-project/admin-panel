import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  const [showForm, setShowForm] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [isFormEditCategory, setIsFormEditCategory] = useState(false);
  const [fields, setFields] = useState([]);
  const [editFormFields, setEditFormFields] = useState([]);
  const [questionSelectedForEdit, setQuestionSelectedForEdit] = useState("");

  const formFields = useMemo(() => {
    return [
      {
        name: "category",
        label: "Category",
        type: "dropdown",
      },
      {
        name: "subcategory",
        label: "Sub Category",
        type: "dropdown",
      },
      {
        name: "question",
        label: "Question",
        type: "text",
      },
      {
        name: "sequence",
        label: "Sequence",
        type: "number",
      },
      {
        name: "field_type",
        label: "Field Type",
        options: ["Text", "Number", "Dropdown", "Toggle"],
        type: "dropdown",
      },
      {
        name: "values",
        label: "Values",
        defaultValue: [""],
        type: "text",
      },
    ];
  }, []);

  const columns = [
    {
      name: "Sr No.",
      cell: (row, index) => (
        <div>{(currentPage - 1) * perPage + (index + 1)}</div>
      ),
    },
    {
      name: "Question",
      selector: (row) => row.question,
    },
    {
      name: "Field Type",
      selector: (row) => row.field_type,
    },
    {
      name: "Required",
      cell: (row) => <Checkbox value={row.is_required} isDisabled={true} />,
      selector: (row) => row.is_required,
    },
    {
      name: "Is Deleted",
      cell: (row) => <Checkbox value={row.is_deleted} isDisabled={true} />,
      selector: (row) => row.is_deleted,
    },
    {
      name: "Created On",
      selector: (row) => moment(row.created_date).format("DD MMM YYYY"),
      compact: true,
    },
    {
      name: "Category/ Sub Category",
      selector: (row) => <div className="text-center">{row.category.id}</div>,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="text-center">
          <MdModeEditOutline
            color="#444"
            size={20}
            onClick={async () => {
              setModalHeading("Edit Question");
              handleEditFormFields(row);
              setIsFormEditCategory(true);
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

  const getQuestions = useCallback(
    async (page) => {
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
      }
    },
    [perPage]
  );

  useEffect(() => {
    getQuestions(1);
  }, [getQuestions]);

  const getCategories = useCallback(async () => {
    try {
      const token = LocalStorage.getData("token");

      const categoriesRespData = await http.get(
        `category/?page=1&page_size=500`,
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

      const items = [
        {
          ...formFields[0],
          options: categories,
        },
        ...formFields.slice(1),
      ];

      setFields(items);
      setEditFormFields(items);
    } catch (error) {
      console.log(error, "145");
    }
  }, [formFields]);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

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
      const subcategories = categoriesRespData.results.map((category) => ({
        id: category.id,
        name: category.name,
      }));

      const items = [
        fields[0],
        {
          ...fields[1],
          options: subcategories,
        },
        ...fields.slice(2),
      ];

      setEditFormFields(items);
      setFields(items);
      return items;
    } catch (error) {
      console.log(JSON.stringify(error), 25);
    }
  };

  const deleteQuestion = async (id) => {
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

  const handleSecondDropdownData = async (id) => {
    await getSubCategories(id);
  };

  const addQuestion = async (quesData) => {
    try {
      const token = LocalStorage.getData("token");
      const url = "question/";
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
        },
      };
      const data = {
        question: quesData.question,
        sequence: quesData.sequence,
        category: {
          ...(quesData.subcategory
            ? { id: quesData.subcategory.id }
            : { id: quesData.category.id }),
        },
        field_type: quesData.field_type,
        ...(quesData.field_type === "Dropdown"
          ? { values: quesData.values }
          : {}),
      };
      const resp = await http.post(url, data, config);
      console.log(resp);
    } catch (error) {
      console.log(JSON.stringify(error), 245);
    } finally {
      //   setLoading(false);
    }
  };

  const checkCategoryOrSubCategory = async (id) => {
    try {
      const token = LocalStorage.getData("token");
      const url = `category/${id}/`;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const resp = await http.get(url, config);

      return resp;
    } catch (error) {
      console.log(JSON.stringify(error), "from checkCategory");
    }
  };

  const updateQuestion = async (quesData) => {
    try {
      const token = LocalStorage.getData("token");
      const url = `question/${questionSelectedForEdit.id}/`;
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
        },
      };
      const data = {
        question: quesData.question,
        sequence: quesData.sequence,
        category: {
          ...(quesData.subcategory
            ? { id: quesData.subcategory.id }
            : { id: quesData.category.id }),
        },
        field_type: quesData.field_type,
        ...(quesData.field_type === "Dropdown"
          ? { values: quesData.values }
          : {}),
      };
      // console.log(data);
      const resp = await http.put(url, data, config);
      console.log(resp);
    } catch (error) {
      console.log(JSON.stringify(error), 245);
    } finally {
      //   setLoading(false);
    }
  };
  const handleAdd = async (event, values) => {
    event.preventDefault();
    console.log("hi", values);
    await addQuestion(values);
    setShowForm(false);
    setModalHeading("");
  };

  const handleEdit = async (event, values) => {
    event.preventDefault();
    console.log("hi", values);
    await updateQuestion(values);
    setShowForm(false);
    setModalHeading("");
  };

  const handleEditFormFields = async (rowData) => {
    console.log("row", rowData);
    let categoryId,
      subCategoryId,
      subCat = "";
    const resp = await checkCategoryOrSubCategory(rowData.category.id);
    if (resp.category == null) {
      categoryId = resp.id;
      subCategoryId = "";
    } else {
      [, subCat] = await getSubCategories(resp.category.id);
      categoryId = resp.category.id;
      subCategoryId = resp.id;
    }
    console.log(subCat, "333");

    const fieldData = editFormFields.map((field) => {
      if (field.name === "category") {
        return {
          ...field,
          defaultValue: { id: categoryId },
        };
      } else if (field.name === "subcategory") {
        return {
          ...subCat,
          defaultValue: subCategoryId ? { id: subCategoryId } : "",
        };
      } else {
        return {
          ...field,
          defaultValue: rowData[field.name],
        };
      }
    });

    console.log(fieldData, "349");
    setEditFormFields(fieldData);
    setQuestionSelectedForEdit(rowData);
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete it ?");
    if (shouldDelete) {
      await deleteQuestion(id);
    }
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
          formFields={isFormEditCategory ? editFormFields : fields}
          formSubmitHandler={isFormEditCategory ? handleEdit : handleAdd}
          isAddFormVisible={true}
          isFormEditCategory={isFormEditCategory}
          isFromQuestion={true}
          isFormReqDropdown={true}
          handleSecondDropdownData={handleSecondDropdownData}
        />
      </div>
    </div>
  );
}
