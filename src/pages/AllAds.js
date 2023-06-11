import React, {useEffect, useState} from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import {LocalStorage} from "../shared/lib";
import {http} from "../shared/lib";
import moment from "moment/moment";
import {MainContent} from "../components/MainContent";
import {MdModeEditOutline, MdDelete} from "react-icons/md";
import { Checkbox } from "../components/checkbox";

export default function AllAds() {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const columns = [
    {
      name: "Sr No.",
      cell: (row, index) => <div>{index + 1}</div>,
    },
    {
      name: "Code",
      selector: row => row.code,
    },
    {
      name: "Title",
      selector: row => row.name,
    },
    {
      name: "Price",
      selector: row => row.price,
    },
    {
      name: "Area",
      selector: row => row.area.name,
    },
    {
      name: "Published On",
      selector: row => moment(row.created_date).format("DD MMM YYYY"),
      compact: true,
    },
    {
      name: "Deleted",
      cell: row => <Checkbox value={!row.is_active} isDisabled={true}/>,
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

  const getUserAds = async page => {
    // setLoading(true);

    try {
      const token = LocalStorage.getData("token");
      const userAds = await http.get(
        `user-ad/?page=${page}&page_size=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTotalRows(userAds.count);
      setData(userAds.results);
    } catch (error) {
      console.log(JSON.stringify(error), 25);
    } finally {
      //   setLoading(false);
    }
  };

  useEffect(() => {
    console.log("User Effect called");
    getUserAds(1);
  }, [perPage]);

  const deleteUserAd = async id => {
    try {
      const token = LocalStorage.getData("token");
      await http.delete(`user-ad/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error, "165");
    }
  };

  const handlePageChange = async page => {
    await getUserAds(page);
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
    await deleteUserAd(id);
  };

  return (
    <div>
      <NavigationBar />
      <div className="d-flex">
        <SidebarMenu />
        <MainContent
          title="UserAds"
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
