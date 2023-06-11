import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import { LocalStorage } from "../shared/lib";
import { http } from "../shared/lib";
import { Image } from "react-bootstrap";
import moment from "moment/moment";
import { MainContent } from "../components/MainContent";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { Checkbox } from "../components/checkbox";

export default function Questions() {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  //   const [loading, setLoading] = useState(false);

  const columns = [
    {
      name: "Sr No.",
      cell: (row, index) => <div>{index + 1}</div>,
    },

    {
      name: "Sub-category",
      selector: (row) => row.name,
    },
    {
      name: "Icon",
      cell: (row) => {
        return <Image src={row.icon} width={40} height={40} />;
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Price\nRequired ",
      cell: (row) => <Checkbox value={row.isPrice} isDisabled={true}/>,
      selector: (row) => row.isPrice,
    },
    {
      name: "Created On",
      selector: (row) => moment(row.created_on).format("DD MMM YYYY"),

      compact: true,
    },
    {
      name: "Price Limit",
      selector: (row) => row.price_limit,

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

  const getCategories = async (page) => {
    // setLoading(true);

    try {
      const token = LocalStorage.getData("token");
      const categoriesRespData = await http.get(
        `category/?page=${page}&page_size=${perPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const categories = categoriesRespData.results.map((category) => ({
        id: category.id.toString(),
        name: category.name,
        icon: category.icon,
        seq: category.sequence,
        isPrice: category.is_price,
        created_on: category.created_date,
        price_limit: category.price_limit,
      }));

      setTotalRows(categoriesRespData.count);
      setData(categories);
    } catch (error) {
      console.log(JSON.stringify(error), 25);
    } finally {
      //   setLoading(false);
    }
  };

  useEffect(() => {
    getCategories(1);
  }, [perPage]);

  const deleteCategory = async (id) => {
    try {
      const token = LocalStorage.getData("token");
      const respData = await http.delete(`category/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error, "165");
    }
  };

  const handlePageChange = async (page) => {
    await getCategories(page);
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
          title="Category"
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
