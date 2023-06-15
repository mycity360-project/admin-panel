import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

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
      accept="image/*"
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

const IconField = ({ field, values, handleChange }) => (
  <Form.Control
    type={field.type}
    label={field.label}
    value={values[field.name]}
    onChange={(e) => {
      console.log(e.currentTarget);
    }}
    accept="image/*"
  />
);

const FormModal = ({ show, onHide, fields, modalHeading }) => {
  const initialValues = {};
  const validationSchema = {};

  fields.forEach((field) => {
    initialValues[field.name] = field.defaultValue ?? "";
    validationSchema[field.name] = field.validation;
  });

  const handleSubmit = (values) => {
    console.log("its me, form ", values);
  };
  const handleIconChange = () => {
    console.log("45");
  };

  const renderField = (
    field,
    values,
    handleChange,
    handleBlur,
    errors,
    touched
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
      case "Icon":
        return <IconField field={field} handleChange={handleChange} />;
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
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
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
                    touched
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
