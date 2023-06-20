import React, { useCallback, useEffect, useMemo, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import { LocalStorage } from "../shared/lib";
import { http } from "../shared/lib";
import { MainContent } from "../components/MainContent";
import { MdModeEditOutline, MdDelete } from "react-icons/md";

export default function Area() {
  const [data, setData] = useState([]); //For datatable
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [isFormEditCategory, setIsFormEditCategory] = useState(false);
  const [fields, setFields] = useState([]);

  const formFields = useMemo(() => {
    return [
      {
        name: "state",
        label: "State",
      },
      {
        name: "location",
        label: "Location",
      },
      {
        name: "area",
        label: "Area",
      },
      {
        name: "pincode",
        label: "Pincode",
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
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Pin Code",
      selector: (row) => row.pincode,
    },
    {
      name: "Location",
      selector: (row) => row.location.name,
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
              //handleEditFormFields(row);
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

  const getArea = async () => {
    // setLoading(true);

    try {
      const token = LocalStorage.getData("token");
      const areaData = await http.get(`area/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(areaData);
    } catch (error) {
      console.log(JSON.stringify(error), 25);
    } finally {
      //   setLoading(false);
    }
  };

  useEffect(() => {
    getArea();
  }, []);

  const getStates = useCallback(async () => {
    // setLoading(true);

    try {
      const token = LocalStorage.getData("token");
      const stateData = await http.get(`state/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const respdata = stateData.map((state, index) => {
        return {
          id: state.id,
          name: state.name,
        };
      });
      console.log(respdata);
      const items = [...formFields];
      items.splice(0, 1, {
        name: "state",
        label: "State",
        options: respdata,
      });
      setFields(items);
    } catch (error) {
      console.log(JSON.stringify(error), 25);
    } finally {
      //   setLoading(false);
    }
  }, [formFields]);

  useEffect(() => {
    getStates();
  }, [getStates]);

  const getLocation = async (id) => {
    // setLoading(true);

    try {
      const token = LocalStorage.getData("token");
      const locationData = await http.get(`location/?state_id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const respdata = locationData.map((location, index) => {
        return {
          id: location.id,
          name: location.name,
        };
      });
      console.log(respdata);
      const items = [...fields];
      items.splice(1, 1, {
        name: "location",
        label: "Location",
        options: respdata,
      });
      setFields(items);
    } catch (error) {
      console.log(JSON.stringify(error), 25);
    } finally {
      //   setLoading(false);
    }
  };

  const deleteArea = async (id) => {
    try {
      const token = LocalStorage.getData("token");
      await http.delete(`area/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error, "165");
    }
  };

  const handleToggleModal = () => {
    setShowForm(!showForm);
    //isFormEditCategory && setIsFormEditCategory(false);
  };

  const handleSecondDropdownData = async (id) => {
    await getLocation(id);
  };

  const addArea = async (areaData) => {
    try {
      const token = LocalStorage.getData("token");
      const url = "area/";
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
        },
      };
      const data = {
        location: {
          id: areaData.location,
        },
        name: areaData.area,
        pincode: areaData.pincode,
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
    await addArea(values);
    setShowForm(false);
    setModalHeading("");
  };

  const handleEdit = () => {
    console.log("edit");
  };

  const handleDelete = async (id) => {
    await deleteArea(id);
  };

  const handlePageChange = async (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage) => {
    setPerPage(newPerPage);
  };

  return (
    <div>
      <NavigationBar />
      <div className="d-flex">
        <SidebarMenu />
        <MainContent
          title="Area"
          data={data}
          modalHeading={modalHeading}
          columns={columns}
          handleAdd={handleAdd}
          handleDelete={handleDelete}
          handlePageChange={handlePageChange}
          handlePerRowsChange={handlePerRowsChange}
          isRemote={false}
          handleToggleModal={handleToggleModal}
          setModalHeading={setModalHeading}
          showForm={showForm}
          formFields={fields}
          formSubmitHandler={isFormEditCategory ? handleEdit : handleAdd}
          isAddFormVisible={true}
          isFormEditCategory={isFormEditCategory}
          isFromQuestion={false}
          isFormReqDropdown={true}
          handleSecondDropdownData={handleSecondDropdownData}
        />
      </div>
    </div>
  );
}
