import React, { useState } from "react";
import { Modal, Row, Col, Button, Form, Image } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

const FormModal = ({
  show,
  onHide,
  fields,
  modalHeading,
  formSubmitHandler,
  isFormEditCategory,
  isSecondDropdown,
  handleSecondDropdown,
}) => {
  const initialValues = {};
  const validationSchema = {};
  const [selectedOption, setSelectedOption] = useState("");
  // const [imageUrl, setImageUrl] = useState("");
  const [isSecondDropdownCreated, setIsSecondDropdownCreated] = useState(false);

  // Component for rendering text fields
  const TextField = ({
    field,
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
  }) => (
    <>
      <Form.Label>{field.label}</Form.Label>
      <Form.Control
        size="sm"
        type={field.type}
        name={field.name}
        value={values[field.name]}
        onChange={handleChange}
        onBlur={handleBlur}
        isInvalid={touched[field.name] && errors[field.name]}
      />
      <Form.Control.Feedback type="invalid">
        {errors[field.name]}
      </Form.Control.Feedback>
    </>
  );

  // Component for rendering checkbox fields
  const CheckboxField = ({ field, values, handleChange, handleBlur }) => (
    <Form.Check
      size="sm"
      type={field.type}
      label={field.label}
      inline
      value={values[field.name]}
      onChange={handleChange}
      onBlur={handleBlur}
      checked={values[field.name]}
    />
  );

  const IconField = ({ field, setFieldValue, values }) => (
    <>
      <Form.Label>{field.label}</Form.Label>
      <Row>
        <Col>
          <Form.Control
            size="sm"
            type={field.type}
            name={field.name}
            onChange={(event) => {
              const file = event.target.files[0];
              setFieldValue(`${field.name}`, file);
            }}
            accept="image/*"
          />
        </Col>

        <Col>
          <Image
            src={
              !isFormEditCategory
                ? URL.createObjectURL(values[field.name])
                : field.defaultValue
            }
            width={35}
            height={35}
            rounded
          />
        </Col>
      </Row>
    </>
  );

  const Dropdown = ({ field, setFieldValue, handleSecondDropdown }) => (
    <Form.Select
      id={field.name}
      size="sm"
      onChange={(event) =>
        handleOptionSelect(event, field, setFieldValue, handleSecondDropdown)
      }
      value={selectedOption ? selectedOption.id : field.defaultValue?.id}
    >
      <option value="">Select {field.label}</option>
      {field.options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </Form.Select>
  );

  fields.forEach((field) => {
    initialValues[field.name] = field.defaultValue ?? "";
    validationSchema[field.name] = field.validation;
  });

  const handleOptionSelect = (
    event,
    field,
    setFieldValue,
    handleSecondDropdown
  ) => {
    const selectedId = event.target.value;
    const selectedOption = field.options.find(
      (option) => option.id === parseInt(selectedId)
    );
    setSelectedOption(selectedOption);
    setFieldValue(`${field.name}`, parseInt(selectedId));
    if (isSecondDropdown) {
      handleSecondDropdown(selectedId);
      //setIsSecondDropdownCreated(true);
    }
  };

  const renderField = (
    field,
    values,
    handleChange,
    handleBlur,
    errors,
    touched,
    setFieldValue
  ) => {
    switch (field.type) {
      case "checkbox": {
        return (
          <CheckboxField
            field={field}
            values={values}
            handleChange={handleChange}
          />
        );
      }
      case "file": {
        return (
          <IconField
            field={field}
            values={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
          />
        );
      }
      case "dropdown": {
        return (
          <Dropdown
            field={field}
            setFieldValue={setFieldValue}
            handleSecondDropdown={handleSecondDropdown}
          />
        );
      }
      default: {
        return (
          <TextField
            field={field}
            values={values}
            handleChange={handleChange}
            handleBlur={handleBlur}
            errors={errors}
            touched={touched}
          />
        );
      }
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{modalHeading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object(validationSchema)}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => (
            <Form onSubmit={(event) => formSubmitHandler(event, values)}>
              {fields.map((field) => (
                <Form.Group
                  controlId={field.name}
                  key={field.name}
                  style={{ padding: 5 }}
                >
                  {renderField(
                    field,
                    values,
                    handleChange,
                    handleBlur,
                    errors,
                    touched,
                    setFieldValue
                  )}
                </Form.Group>
              ))}
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default FormModal;
