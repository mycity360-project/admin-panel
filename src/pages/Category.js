import React, { useCallback, useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import { LocalStorage } from "../shared/lib";
import { http } from "../shared/lib";
import { Image } from "react-bootstrap";
import moment from "moment/moment";
import { MainContent } from "../components/MainContent";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { Checkbox } from "../components/checkbox";

export default function Category() {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const addFormFeilds = [
    {
      name: "name",
      label: "Name",
      type: "text",
    },
    {
      name: "icon",
      label: "Icon",
      type: "file",
    },
    {
      name: "price_limit",
      label: "Price Limit",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "is_price_required",
      label: "Is Price Required",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "phone",
      label: "Phone",
      type: "number",
    },
  ];

  const columns = [
    {
      name: "Sr No.",
      cell: (row, index) => {
        return <div> {(currentPage - 1) * perPage + (index + 1)}</div>;
      },
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
    },
    {
      name: "Price\nRequired ",
      cell: (row) => <Checkbox value={row.isPrice} isDisabled={true} />,
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
      name: "Action",
      cell: (row) => (
        <div className="text-center">
          <MdModeEditOutline
            color="#444"
            size={20}
            onClick={() => handleEdit(row)}
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

  const getCategories = useCallback(
    async (page) => {
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
          id: category.id,
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
    },
    [perPage]
  );

  useEffect(() => {
    getCategories(1);
  }, [getCategories]);

  const deleteCategory = async (id) => {
    try {
      const token = LocalStorage.getData("token");
      await http.delete(`category/${id}/`, {
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
    await getCategories(page);
  };

  const handlePerRowsChange = async (newPerPage) => {
    setPerPage(newPerPage);
  };

  const handleEdit = (values) => {
    console.log("edit", values);
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete it ?");
    if (shouldDelete) {
      await deleteCategory(id);
    }
  };

  const handleToggleModal = () => {
    setShowForm(!showForm);
  };

  const uploadIcon = async (file, id) => {
    try {
      const iconData = new FormData();

      iconData.append("file", file);

      const token = LocalStorage.getData("token");

      const url = `category/icon/${id}/`;
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const resp = await http.post(url, iconData, config);
      console.log(resp, "199");
    } catch (error) {
      console.log(error, "201");
    }
  };

  const createCategory = async (values) => {
    try {
      const token = LocalStorage.getData("token");
      const url = "category/";
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
        },
      };
      const data = {
        name: values.name,
        phone: values.phone,
        is_price: values.is_price_required,
        price_limit: values.price_limit,
      };
      const resp = await http.post(url, data, config);
      return resp;
    } catch (error) {
      console.log(error, "223");
    }
  };

  const handleAdd = async (event, values) => {
    event.preventDefault();
    console.log("hi", values);
    const resp = await createCategory(values);
    resp && (await uploadIcon(values.icon, resp.id));
    setShowForm(false);
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
          handleDelete={handleDelete}
          handleToggleModal={handleToggleModal}
          showForm={showForm}
          fields={addFormFeilds}
          modalHeading={"Add Category"}
          handleAdd={handleAdd}
          isRemote={true}
          isAddFormVisible={true}
        />
      </div>
    </div>
  );
}
