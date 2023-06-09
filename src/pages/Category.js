import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import { LocalStorage } from "../shared/lib";
import { http } from "../shared/lib";
import { Image } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { Form } from "react-bootstrap";
import moment from "moment/moment";
import { differenceBy } from "lodash";
import { useLocation } from "react-router-dom";

export default function Category() {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  //   const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname, "24");
    if (location.pathname === "/home/category") {
      setActiveMenuItem("category");
    }
  }, []);

  const columns = [
    {
      name: "Sr No.",
      cell: (row, index) => <div>{index + 1}</div>,
    },
    {
      name: "ID",
      selector: (row) => row.id,
    },
    {
      name: "Category",
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
      name: "Price Required ",
      cell: (row) => {
        return (
          <Form>
            <div className="text-center">
              <Form.Check
                type="checkbox"
                aria-label="Price"
                checked={row.isPrice}
                disabled={true}
              />
            </div>
          </Form>
        );
      },
      selector: (row) => row.isPrice,
    },
    {
      name: "Created On",
      selector: (row) => moment(row.created_on).format("DD MMM YYYY"),
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

  const handleRowSelected = React.useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const contextActions = React.useMemo(() => {
    const handleDelete = () => {
      if (
        window.confirm(
          `Are you sure you want to delete:\r ${selectedRows.map(
            (r) => r.title
          )}?`
        )
      ) {
        setToggleCleared(!toggleCleared);
        setData(differenceBy(data, selectedRows, "title"));
      }
    };

    return (
      <Button
        key="delete"
        onClick={handleDelete}
        style={{ backgroundColor: "red" }}
        icon
      >
        Delete
      </Button>
    );
  }, [data, selectedRows, toggleCleared]);

  return (
    <div>
      <NavigationBar />
      <SidebarMenu
        title="Category"
        data={data}
        columns={columns}
        selectable={true}
        contextActions={contextActions}
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        totalRows={totalRows}
        handlePageChange={handlePageChange}
        handlePerRowsChange={handlePerRowsChange}
        activeMenuItem={"category"}
      />
    </div>
  );
}
