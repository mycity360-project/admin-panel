import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import Sidebar from "../components/SideBar";
import { LocalStorage } from "../shared/lib";
import { http } from "../shared/lib";
import { Image } from "react-bootstrap";
import Button from "react-bootstrap/Button";

export default function Category() {
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
      name: "ID",
      selector: "id",
    },
    {
      name: "Category",
      selector: (row) => row.name,
    },
    {
      name: "Icon",
      cell: (row) => {
        return <Image src={row.icon} width={30} height={30} />;
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Price Required",
      selector: (row) => row.isPrice,
    },
    {
      name: "Created On",
      selector: (row) => row.created_on,
    },
    {
      name: "Price Limit",
      selector: (row) => row.price_limit,
    },
    {
      cell: (row) => (
        <div className="text-center">
          <Button variant="light" onClick={() => console.log("edit 52")}>
            Edit
          </Button>
          <Button variant="danger">Delete</Button>
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

  const handlePageChange = (page) => {
    getCategories(page);
  };

  const handlePerRowsChange = async (newPerPage) => {
    setPerPage(newPerPage);
  };

  return (
    <div>
      <NavigationBar />
      <Sidebar
        title="Category"
        data={data}
        columns={columns}
        totalRows={totalRows}
        handlePageChange={handlePageChange}
        handlePerRowsChange={handlePerRowsChange}
      />
    </div>
  );
}
