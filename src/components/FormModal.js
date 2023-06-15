import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

const FormModal = ({
  show,
  onHide,
  fields,
  modalHeading,
  handleAddCategory,
}) => {
  const initialValues = {};
  const validationSchema = {};

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
      type={field.type}
      label={field.label}
      inline
      value={values[field.name]}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );

  const IconField = ({ field, setFieldValue }) => (
    <>
      <Form.Label>{field.label}</Form.Label>
      <Form.Control
        type={field.type}
        name={field.name}
        onChange={(event) => {
          const file = event.target.files[0];
          setFieldValue("icon", file);
        }}
        accept="image/*"
      />
    </>
  );

  fields.forEach((field) => {
    initialValues[field.name] = field.defaultValue ?? "";
    validationSchema[field.name] = field.validation;
  });

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
      case "checkbox":
        return (
          <CheckboxField
            field={field}
            values={values}
            handleChange={handleChange}
          />
        );
      case "file":
        return (
          <IconField
            field={field}
            values={values}
            errors={errors}
            touched={touched}
            setFieldValue={setFieldValue}
          />
        );
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
            handleSubmit,
            setFieldValue,
          }) => (
            <Form onSubmit={(event) => handleAddCategory(event, values)}>
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
