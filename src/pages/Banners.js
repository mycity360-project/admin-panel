import React, { useCallback, useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import { LocalStorage } from "../shared/lib";
import { http } from "../shared/lib";
import { Image } from "react-bootstrap";
import moment from "moment/moment";
import { MainContent } from "../components/MainContent";
import { MdModeEditOutline, MdDelete } from "react-icons/md";

export default function Banners() {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  //   const [loading, setLoading] = useState(false);

  const columns = [
    {
      name: "Sr No.",
      cell: (row, index) => (
        <div>{(currentPage - 1) * perPage + (index + 1)}</div>
      ),
    },
    {
      name: "Area",
      selector: (row) => row.area.id,
    },
    {
      name: "Image",
      selector: (row) => <Image src={row.image} width={40} height={40} />,
    },
    {
      name: "Url",
      selector: (row) => row.redirect_url,
    },
    {
      name: "Created on",
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
            onClick={() => handleEdit()}
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

  const getBanners = useCallback(
    async (page) => {
      // setLoading(true);

      try {
        const token = LocalStorage.getData("token");
        const bannerResp = await http.get(
          `banner/?page=${page}&page_size=${perPage}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setTotalRows(bannerResp.count);
        setData(bannerResp.results);
      } catch (error) {
        console.log(JSON.stringify(error));
      } finally {
        //   setLoading(false);
      }
    },
    [perPage]
  );

  useEffect(() => {
    getBanners(1);
  }, [getBanners]);

  const deleteCategory = async (id) => {
    try {
      const token = LocalStorage.getData("token");
      await http.delete(`banner/${id}/`, {
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
    await getBanners(page);
  };

  const handlePerRowsChange = async (newPerPage) => {
    setPerPage(newPerPage);
  };

  const handleAdd = () => {
    console.log("add");
  };

  const handleEdit = () => {
    console.log("edit");
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
          data={data}
          columns={columns}
          totalRows={totalRows}
          handlePageChange={handlePageChange}
          handlePerRowsChange={handlePerRowsChange}
          handleAdd={handleAdd}
          handleDelete={handleDelete}
          isRemote={true}
        />
      </div>
    </div>
  );
}
