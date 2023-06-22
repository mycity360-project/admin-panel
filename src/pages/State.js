import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import { LocalStorage } from "../shared/lib";
import { http } from "../shared/lib";
import { MainContent } from "../components/MainContent";
import { MdModeEditOutline, MdDelete } from "react-icons/md";

export default function State() {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [isFormEditCategory, setIsFormEditCategory] = useState(false);
  const [editFormFields, setEditFormFields] = useState([]);
  const [stateIdSelectedForEdit, setStateIdSelectedForEdit] = useState("");

  const formFields = [
    { name: "name", label: "Location", type: "text" },
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
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="text-center">
          <MdModeEditOutline
            color="#444"
            size={20}
            onClick={() => {
              setModalHeading("Edit Location");
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

  const getStates = async () => {
    // setLoading(true);

    try {
      const token = LocalStorage.getData("token");
      const stateData = await http.get(`state/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(stateData);
    } catch (error) {
      console.log(JSON.stringify(error), 25);
    } finally {
      //   setLoading(false);
    }
  };

  useEffect(() => {
    getStates();
  }, []);

  const deleteState = async (id) => {
    try {
      const token = LocalStorage.getData("token");
      await http.delete(`state/${id}/`, {
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
  };

  const handlePerRowsChange = async (newPerPage) => {
    setPerPage(newPerPage);
  };

  const addState = async (stateData) => {
    try {
      const token = LocalStorage.getData("token");
      const url = "state/";
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
        },
      };

      const data = {
        name: stateData.name,
        is_active: stateData.is_active,
      };

      const resp = await http.post(url, data, config);
      console.log(resp);
    } catch (error) {
      console.log(JSON.stringify(error), 245);
    } finally {
      //   setLoading(false);
    }
  };

  const updateState = async (stateData, id) => {
    try {
      const token = LocalStorage.getData("token");
      const url = `state/${id}/`;
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
        },
      };

      const data = {
        name: stateData.name,
        is_active: stateData.is_active,
      };

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
    await addState(values);
    setShowForm(false);
    setModalHeading("");
  };

  const handleEdit = async (event, values) => {
    event.preventDefault();
    console.log("hi", values);
    await updateState(values, stateIdSelectedForEdit);
    setShowForm(false);
    setModalHeading("");
  };

  const handleEditFormFields = (rowData) => {
    const fields = formFields.map((field) => {
      return {
        ...field,
        defaultValue: rowData[field.name],
      };
    });
    console.log(rowData, fields);
    setStateIdSelectedForEdit(rowData.id);
    setEditFormFields(fields);
  };

  const handleDelete = async (id) => {
    await deleteState(id);
  };
  const handleToggleModal = () => {
    setShowForm(!showForm);
    isFormEditCategory && setIsFormEditCategory(false);
  };

  return (
    <div>
      <NavigationBar />
      <div className="d-flex">
        <SidebarMenu />
        <MainContent
          title="State"
          data={data}
          modalHeading={modalHeading}
          columns={columns}
          isRemote={false}
          handleAdd={handleAdd}
          handleDelete={handleDelete}
          handlePageChange={handlePageChange}
          handlePerRowsChange={handlePerRowsChange}
          handleToggleModal={handleToggleModal}
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
