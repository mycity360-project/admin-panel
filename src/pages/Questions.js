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

  const formFields = useMemo(() => {
    return [
      {
        name: "category",
        label: "Category",
      },
      {
        name: "subcategory",
        label: "Sub Category",
      },
      {
        name: "question",
        label: "Question",
      },
      {
        name: "sequence",
        label: "Sequence",
      },
      {
        name: "field_type",
        label: "Field Type",
        options: ["Text", "Number", "Dropdown", "Toggle"],
      },
      {
        name: "values",
        label: "Values",
        defaultValue: [""],
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
            onClick={async () => {
              setModalHeading("Edit Category");
              setIsFormEditCategory(true);
              handleSecondDropdownData(row.category?.id);
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
      const items = [...formFields];
      items.splice(0, 1, {
        name: "category",
        label: "Category",
        options: categories,
      });
      setFields(items);
      setEditFormFields(items);
    } catch (error) {
      console.log(error, "145");
    } finally {
      //   setLoading(false);
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
      // const items = [...fields];
      // items.splice(1, 1, {
      //   name: "subcategory",
      //   label: "Sub Category",
      //   options: subcategories,
      // });
      const items = [
        fields[0],
        {
          ...fields[1],
          options: subcategories,
        },
        ...fields.slice(2),
      ];
      setFields(items);
      setEditFormFields(items);
    } catch (error) {
      console.log(JSON.stringify(error), 25);
    } finally {
      //   setLoading(false);
    }
  };

  // const deleteCategory = async (id) => {
  //   try {
  //     const token = LocalStorage.getData("token");

  //     await http.delete(`question/${id}/`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error, "165");
  //   }
  // };

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
            ? { id: quesData.subcategory }
            : { id: quesData.category }),
        },
        field_type: quesData.field_type,
        ...(quesData.field_type === "Dropdown"
          ? { values: quesData.values_dropdown }
          : {}),
      };
      // console.log(data);
      const resp = await http.post(url, data, config);
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

  const handleEdit = (event, values) => {
    event.preventDefault();
    console.log("edit", values);
  };

  const handleEditFormFields = (rowData) => {
    const fieldData = editFormFields.map((field) => {
      return {
        ...field,
        defaultValue: rowData[field.name],
      };
    });
    console.log(fieldData);
    setEditFormFields(fieldData);
  };

  const handleDelete = async (id) => {
    //await deleteCategory(id);
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
