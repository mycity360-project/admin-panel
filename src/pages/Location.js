import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import { LocalStorage } from "../shared/lib";
import { http } from "../shared/lib";
import { MainContent } from "../components/MainContent";
import { MdModeEditOutline, MdDelete } from "react-icons/md";

export default function Location() {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [states, setStates] = useState([]);
  const [modalHeading, setModalHeading] = useState("");
  const [isFormEditCategory, setIsFormEditCategory] = useState(false);
  const [editFormFields, setEditFormFields] = useState([]);
  const [stateIdSelectedForEdit, setStateIdSelectedForEdit] = useState("");

  const formFields = [
    {
      name: "state",
      label: "State",
      type: "dropdown",
      options: states,
    },
    { name: "name", label: "Location", type: "text" },
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
      name: "state",
      selector: (row) => row.state.name,
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

  const getLocation = async () => {
    // setLoading(true);

    try {
      const token = LocalStorage.getData("token");
      const locationData = await http.get(`location/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(locationData);
    } catch (error) {
      console.log(JSON.stringify(error), 25);
    } finally {
      //   setLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const getStates = async () => {
    // setLoading(true);

    try {
      const token = LocalStorage.getData("token");
      const stateData = await http.get(`state/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStates(stateData);
    } catch (error) {
      console.log(JSON.stringify(error), 25);
    } finally {
      //   setLoading(false);
    }
  };

  useEffect(() => {
    getStates();
  }, []);

  const deleteLocation = async (id) => {
    try {
      const token = LocalStorage.getData("token");
      await http.delete(`location/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error, "165");
    }
  };

  const addLocation = async (locationData) => {
    try {
      const token = LocalStorage.getData("token");
      const url = "location/";
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
        },
      };

      const data = {
        name: locationData.name,
        state: { id: locationData.state },
      };

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
    await addLocation(values);
    setShowForm(false);
    setModalHeading("");
  };

  const updateLocation = async (locationData, id) => {
    try {
      const token = LocalStorage.getData("token");
      const url = `location/${id}/`;
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
        },
      };

      const data = {
        state: { id: locationData.state.id },
        name: locationData.name,
      };

      console.log(data);
      const resp = await http.put(url, data, config);
      console.log(resp);
    } catch (error) {
      console.log(JSON.stringify(error), 245);
    } finally {
      //   setLoading(false);
    }
  };

  const handleEdit = async (event, values) => {
    event.preventDefault();
    console.log("hi", values);
    await updateLocation(values, stateIdSelectedForEdit);
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
    const shouldDelete = window.confirm("Are you sure you want to delete it ?");
    if (shouldDelete) {
      await deleteLocation(id);
    }
  };
  const handlePageChange = async (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage) => {
    setPerPage(newPerPage);
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
          title="Location"
          modalHeading={modalHeading}
          data={data}
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
