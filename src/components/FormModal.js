import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";

const FormModal = ({ show, onHide, fields, modalHeading }) => {
  const initialValues = {};
  const validationSchema = {};

  fields.forEach((field) => {
    initialValues[field.name] = field.defaultValue || "";
    validationSchema[field.name] = field.validation;
  });

  const handleSubmit = (values) => {
    console.log("its me , form ", values);
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
                <Form.Group controlId={field.name} key={field.name}>
                  {field.type !== "checkbox" ? (
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
                    </>
                  ) : (
                    <Form.Check
                      type={field.type}
                      inline
                      label={field.name}
                      id="default-checkbox"
                      value={values[field.name]}
                      defaultValue={field.defaultValue}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  )}

                  <Form.Control.Feedback type="invalid">
                    {errors[field.name]}
                  </Form.Control.Feedback>
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
