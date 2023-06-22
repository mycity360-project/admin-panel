import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import SidebarMenu from "../components/SidebarMenu";
import { LocalStorage } from "../shared/lib";
import { http } from "../shared/lib";
import { Image } from "react-bootstrap";
import moment from "moment/moment";
import { MainContent } from "../components/MainContent";
import { MdModeEditOutline, MdDelete } from "react-icons/md";

export default function Service() {
  const [data, setData] = useState([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [modalHeading, setModalHeading] = useState("");
  const [isFormEditCategory, setIsFormEditCategory] = useState(false);
  const [editFormFields, setEditFormFields] = useState([]);
  const [serviceSelectedForEdit, setServiceSelectedForEdit] = useState("");

  const formFields = [
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
      name: "images",
      label: "Images",
      type: "file",
    },
    {
      name: "description",
      label: "Description",
      type: "text",
    },
    {
      name: "phone",
      label: "Phone",
      type: "number",
    },
    {
      name: "sequence",
      label: "Sequence",
      type: "Number",
    },
    {
      name: "is_active",
      label: "Is Active",
      type: "checkbox",
    },
  ];
  const columns = [
    {
      name: "Sr No.",
      cell: (row, index) => (
        <div>{(currentPage - 1) * perPage + (index + 1)}</div>
      ),
    },
    {
      name: "Sequence",
      selector: (row) => row.sequence,
    },
    {
      name: "Name",
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
      name: "Created On",
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
            onClick={() => {
              handleEditFormFields(row);
              setModalHeading("Edit Location");
              setIsFormEditCategory(true);
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
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const getService = async () => {
    // setLoading(true);

    try {
      const token = LocalStorage.getData("token");
      const services = await http.get(`service/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(services);
      setData(services);
    } catch (error) {
      console.log(JSON.stringify(error), 25);
    } finally {
      //   setLoading(false);
    }
  };

  useEffect(() => {
    getService();
  }, []);

  const uploadImage = async (image) => {
    try {
      const imageData = new FormData();

      imageData.append("file", image);

      const token = LocalStorage.getData("token");

      const url = `image/`;
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const resp = await http.post(url, imageData, config);
      console.log(resp, "199");
      return resp;
    } catch (error) {
      console.log(error, "201");
    }
  };

  const createService = async (serviceData, imagesResp) => {
    try {
      const token = LocalStorage.getData("token");
      const url = "service/";
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
        },
      };

      const data = {
        name: serviceData.name,
        description: serviceData.description,
        phone: serviceData.phone,
        images: imagesResp,
        sequence: serviceData.sequence,
        code: serviceData.name.trim(),
        is_active: serviceData.is_active,
      };
      console.log("191", data);
      const resp = await http.post(url, data, config);
      console.log(resp);
      return resp;
    } catch (error) {
      console.log(JSON.stringify(error), 245);
    } finally {
      //   setLoading(false);
    }
  };

  const updateService = async (serviceData, imagesResp) => {
    try {
      const token = LocalStorage.getData("token");
      const url = `service/${serviceSelectedForEdit.id}/`;
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
        },
      };
      const data = {
        name: serviceData.name,
        description: serviceData.description,
        phone: serviceData.phone,
        images: imagesResp,
        sequence: serviceData.sequence,
        code: serviceData.name.trim(),
        is_active: serviceData.is_active,
      };

      const resp = await http.put(url, data, config);
      console.log(resp);
      return resp;
    } catch (error) {
      console.log(JSON.stringify(error), 245);
    } finally {
      //   setLoading(false);
    }
  };

  const uploadIcon = async (icon, id) => {
    try {
      const iconData = new FormData();

      iconData.append("file", icon);

      const token = LocalStorage.getData("token");

      const url = `service/icon/${id}/`;
      const config = {
        headers: {
          " Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      console.log(icon, id);
      const resp = await http.post(url, iconData, config);
      console.log(resp, "199");
    } catch (error) {
      console.log(error, "201");
    }
  };

  const deleteService = async (id) => {
    try {
      const token = LocalStorage.getData("token");
      await http.delete(`service/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error, "165");
    }
  };

  const deleteImage = async (imageId) => {
    try {
      const token = LocalStorage.getData("token");
      await http.delete(`image/${imageId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("deleted images");
    } catch (error) {
      console.log(error, "165");
    }
  };

  const handleAdd = async (event, values) => {
    event.preventDefault();
    console.log("hi", values);
    const imagesToUpload = values.images;
    let uploadedImgArr = [];
    if (imagesToUpload.length > 0) {
      for (let [_, image] of Object.entries(imagesToUpload)) {
        let resp = await uploadImage(image);
        uploadedImgArr.push(resp);
      }
    }
    const respService = await createService(values, uploadedImgArr);
    await uploadIcon(values.icon, respService.id);
    setShowForm(false);
    setModalHeading("");
  };

  const handleEdit = async (event, values) => {
    event.preventDefault();
    console.log("hi", values);

    const imagesToUpload = values.images;
    let uploadedImgArr = [];
    if (values.isImgChanged) {
      console.log("image se");
      for (let [_, image] of Object.entries(imagesToUpload)) {
        let resp = await uploadImage(image);
        uploadedImgArr.push(resp);
      }
    } else {
      uploadedImgArr = serviceSelectedForEdit.images;
    }
    await updateService(values, uploadedImgArr);
    if (values.isIconChanged) {
      console.log("icon se");
      await uploadIcon(values.icon, serviceSelectedForEdit.id);
    }
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
    setServiceSelectedForEdit(rowData);
    setEditFormFields(fields);
  };

  const handleDelete = async (rowData) => {
    const shouldDelete = window.confirm("Are you sure you want to delete it ?");
    if (shouldDelete) {
      await deleteService(rowData.id);
      if (rowData.images > 0) {
        for (let [_, image] of Object.entries(rowData.images)) {
          await deleteImage(image.id);
        }
      }
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
          title={"Service"}
          data={data}
          columns={columns}
          modalHeading={modalHeading}
          handlePageChange={handlePageChange}
          handlePerRowsChange={handlePerRowsChange}
          isRemote={false}
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
