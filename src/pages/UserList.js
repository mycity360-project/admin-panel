import React, {useEffect, useState} from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import {LocalStorage} from "../shared/lib";
import {http} from "../shared/lib";
import moment from "moment/moment";
import {MainContent} from "../components/MainContent";
import {MdModeEditOutline, MdDelete} from "react-icons/md";

export default function UserList() {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const columns = [
    {
      name: "Sr No.",
      cell: (row, index) => <div>{index + 1}</div>,
    },
    {
      name: "Email",
      selector: row => row.email,
    },
    {
      name: "Phone",
      selector: row => row.phone,
    },
    {
      name: "Name",
      selector: row => `${row.first_name} ${row.last_name}`,
    },
    {
      name: "Location",
      selector: row => row.area.location.name,
    },
    {
      name: "Area",
      selector: row => row.area.name,
    },
    {
      name: "Created On",
      selector: row => moment(row.created_date).format("DD MMM YYYY"),
      compact: true,
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

  const getUserList = async page => {
    // setLoading(true);

    try {
      const token = LocalStorage.getData("token");
      const userList = await http.get(
        `user/?page=${page}&page_size=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTotalRows(userList.count);
      setData(userList.results);
    } catch (error) {
      console.log(JSON.stringify(error), 25);
    } finally {
      //   setLoading(false);
    }
  };

  useEffect(() => {
    getUserList(1);
  }, [perPage]);

  const deleteArea = async id => {
    try {
      const token = LocalStorage.getData("token");
      await http.delete(`user/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error, "165");
    }
  };

  const handlePageChange = async page => {
    await getUserList(page);
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
    await deleteArea(id);
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
