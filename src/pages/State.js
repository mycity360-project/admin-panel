import React, {useEffect, useState} from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import {LocalStorage} from "../shared/lib";
import {http} from "../shared/lib";
import {MainContent} from "../components/MainContent";
import {MdModeEditOutline, MdDelete} from "react-icons/md";

export default function State() {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const columns = [
    {
      name: "Sr No.",
      cell: (row, index) => <div>{index + 1}</div>,
    },
    {
      name: "Name",
      selector: row => row.name,
    },
    {
      name: "Action",
      cell: row => (
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
            style={{marginLeft: "10px"}}
            onClick={() => handleDelete(row.id)}
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const getStates = async page => {
    // setLoading(true);

    try {
      const token = LocalStorage.getData("token");
      const stateData = await http.get(
        `state/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(stateData)
      setTotalRows(stateData.length);
      setData(stateData);
    } catch (error) {
      console.log(JSON.stringify(error), 25);
    } finally {
      //   setLoading(false);
    }
  };

  useEffect(() => {
    getStates(1);
  }, [perPage]);

  const deleteState = async id => {
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

  const handlePageChange = async page => {
    await getStates(page);
  };

  const handlePerRowsChange = async newPerPage => {
    setPerPage(newPerPage);
  };

  const handleAdd = () => {
    console.log("add");
  };

  const handleEdit = () => {
    console.log("edit");
  };

  const handleDelete = async id => {
    await deleteState(id);
  };

  return (
    <div>
      <NavigationBar />
      <div className="d-flex">
        <SidebarMenu />
        <MainContent
          title="Area"
          data={data}
          columns={columns}
          totalRows={totalRows}
          handlePageChange={handlePageChange}
          handlePerRowsChange={handlePerRowsChange}
          handleAdd={handleAdd}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}
