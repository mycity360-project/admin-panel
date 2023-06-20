import React, { useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Formik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
import { MdDelete } from "react-icons/md";
//IoMdAddCircleOutline
const FormDropdownModal = ({
  show,
  onHide,
  modalHeading,
  formSubmitHandler,
  isFormEditCategory,
  isFromQuestion,
  formFields,
  handleSecondDropdownData,
}) => {
  console.log(formFields, 18);
  const initialValues = {};
  const validationSchema = {};
  const [firstDropdownData, setFirstDropdownData] = useState(formFields[0]);
  const [secondDropdownData, setSecondDropdownData] = useState(formFields[1]);
  const [thirdDropdownData, setThirdDropdownData] = useState(
    formFields[4] || []
  );
  const [areaOrQuestionInputFieldData, SetAreaOrQuestionInputFieldData] =
    useState(formFields[2]);
  const [sequenceOrPincodeFieldData, setSequenceOrPincodeFieldData] = useState(
    formFields[3]
  );
  const [questionDropdownData, setQuestionDropdownData] = useState(
    formFields[5] || []
  );

  const [firstDropdownSelectedData, setFirstDropdownSelectedData] =
    useState("");
  const [secondDropdownSelectedData, setSecondDropdownSelectedData] =
    useState("");
  const [thirdDropdownSelectedData, setThirdDropdownSelectedData] =
    useState("");
  const [showSecondDropdown, setShowSecondDropdown] = useState(false);

  formFields.forEach((field) => {
    initialValues[field.name] = field.defaultValue ?? "";
    validationSchema[field.name] = field.validation;
  });

  useEffect(() => {
    setFirstDropdownData(formFields[0]);
    setSecondDropdownData(formFields[1]);
    SetAreaOrQuestionInputFieldData(formFields[2]);
    if (isFromQuestion) {
      setSequenceOrPincodeFieldData(formFields[3]);
      setThirdDropdownData(formFields[4]);
      setQuestionDropdownData(formFields[5]);
    }
  }, [formFields, isFromQuestion]);

  useEffect(() => {
    if (secondDropdownData.options?.length) {
      setShowSecondDropdown(true);
    }
    console.log(secondDropdownData);
  }, [secondDropdownData]);

  const handleOptionSelectFirstDropdown = (event, setFieldValue) => {
    const selectedId = event.target.value;
    handleSecondDropdownData(parseInt(selectedId));
    const selectedItem = firstDropdownData.options.find(
      (option) => option.id === parseInt(selectedId)
    );
    setFirstDropdownSelectedData(selectedItem);
    setFieldValue(`${firstDropdownData.name}`, parseInt(selectedId));
    // setShowSecondDropdown(true);
  };

  const handleOptionSelectSecondDropdown = (event, setFieldValue) => {
    const selectedId = event.target.value;
    const selectedItem = secondDropdownData.options.find(
      (option) => option.id === parseInt(selectedId)
    );
    setSecondDropdownSelectedData(selectedItem);
    setFieldValue(`${secondDropdownData.name}`, parseInt(selectedId));
  };

  const handleOptionSelectThirdDropdown = (event, setFieldValue) => {
    const selectedValue = event.target.value;
    setThirdDropdownSelectedData(selectedValue);
    setFieldValue(`${thirdDropdownData.name}`, selectedValue);
  };

  const handleAddInputField = (setFieldValue, values) => {
    console.log(values, "before add");
    setFieldValue(questionDropdownData.name, [
      ...values[questionDropdownData.name],
      "",
    ]);
    console.log(values, "after add");
  };

  const handleDeleteInputField = (index, setFieldValue, values) => {
    const updatedValues = [...values[questionDropdownData.name]];
    updatedValues.splice(index, 1);
    setFieldValue(questionDropdownData.name, updatedValues);
  };

  return (
    <div>
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
              handleChange,
              handleBlur,
              isSubmitting,
              errors,
              touched,
              setFieldValue,
            }) => (
              <Form onSubmit={(event) => formSubmitHandler(event, values)}>
                <Form.Group
                  controlId={firstDropdownData.name}
                  key={firstDropdownData.name}
                  style={{ padding: 5 }}
                >
                  <Form.Label>{firstDropdownData.label}</Form.Label>
                  <Form.Select
                    id={firstDropdownData.name}
                    size="sm"
                    onChange={(event) =>
                      handleOptionSelectFirstDropdown(event, setFieldValue)
                    }
                    onClick={() => setShowSecondDropdown(false)}
                    value={
                      firstDropdownSelectedData
                        ? firstDropdownSelectedData?.id
                        : firstDropdownData.defaultValue?.id
                    }
                  >
                    <option value="">Select {firstDropdownData.label}</option>
                    {firstDropdownData.options?.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                {showSecondDropdown && (
                  <Form.Group
                    controlId={secondDropdownData.name}
                    key={secondDropdownData.name}
                    style={{ padding: 5 }}
                  >
                    <Form.Label>{secondDropdownData.label}</Form.Label>
                    <Form.Select
                      id={secondDropdownData.name}
                      size="sm"
                      onChange={(event) =>
                        handleOptionSelectSecondDropdown(event, setFieldValue)
                      }
                      value={
                        secondDropdownSelectedData
                          ? secondDropdownSelectedData?.id
                          : secondDropdownData.defaultValue?.id
                      }
                    >
                      <option value="">
                        Select {secondDropdownData.label}
                      </option>
                      {secondDropdownData.options?.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
                <Form.Group
                  controlId={areaOrQuestionInputFieldData.name}
                  key={areaOrQuestionInputFieldData.name}
                  style={{ padding: 5 }}
                >
                  <Form.Label>{areaOrQuestionInputFieldData.label}</Form.Label>
                  <Form.Control
                    size="sm"
                    type="text"
                    name={areaOrQuestionInputFieldData.name}
                    value={values[areaOrQuestionInputFieldData.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      touched[areaOrQuestionInputFieldData.name] &&
                      errors[areaOrQuestionInputFieldData.name]
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[areaOrQuestionInputFieldData.name]}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  controlId={sequenceOrPincodeFieldData.name}
                  key={sequenceOrPincodeFieldData.name}
                  style={{ padding: 5 }}
                >
                  <Form.Label>{sequenceOrPincodeFieldData.label}</Form.Label>
                  <Form.Control
                    size="sm"
                    type="number"
                    name={sequenceOrPincodeFieldData.name}
                    value={values[sequenceOrPincodeFieldData.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={
                      touched[sequenceOrPincodeFieldData.name] &&
                      errors[sequenceOrPincodeFieldData.name]
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors[sequenceOrPincodeFieldData.name]}
                  </Form.Control.Feedback>
                </Form.Group>
                {isFromQuestion && (
                  <Form.Group
                    controlId={thirdDropdownData.name}
                    key={thirdDropdownData.name}
                    style={{ padding: 5 }}
                  >
                    <Form.Label>{thirdDropdownData.label}</Form.Label>
                    <Form.Select
                      id={thirdDropdownData.name}
                      size="sm"
                      onChange={(event) =>
                        handleOptionSelectThirdDropdown(event, setFieldValue)
                      }
                      value={
                        thirdDropdownSelectedData ||
                        thirdDropdownData.defaultValue
                      }
                    >
                      <option value="">Select {thirdDropdownData.label}</option>
                      {thirdDropdownData.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}

                {thirdDropdownSelectedData === "Dropdown" && (
                  <>
                    <Form.Label>Enter {questionDropdownData.label}</Form.Label>
                    <Row>
                      <Col>
                        {values[questionDropdownData.name]?.map(
                          (inputValue, index) => (
                            <div key={index}>
                              <Form.Group>
                                <Form.Control
                                  size="sm"
                                  type="text"
                                  value={inputValue}
                                  onChange={(event) => {
                                    const updatedValues = [
                                      ...values[questionDropdownData.name],
                                    ];
                                    updatedValues[index] = event.target.value;
                                    setFieldValue(
                                      questionDropdownData.name,
                                      updatedValues
                                    );
                                  }}
                                />
                              </Form.Group>
                              <MdDelete
                                color="#333"
                                size={20}
                                cursor="pointer"
                                style={{
                                  marginLeft: "10px",
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.color = "red";
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.color = "#333";
                                }}
                                onClick={() => {
                                  console.log("delete");
                                  handleDeleteInputField(
                                    index,
                                    setFieldValue,
                                    values
                                  );
                                }}
                              />
                            </div>
                          )
                        )}
                      </Col>
                    </Row>
                    <Button
                      className="float-right"
                      variant="success"
                      size="sm"
                      onClick={() => {
                        console.log("add");
                        handleAddInputField(setFieldValue, values);
                      }}
                    >
                      Add Input Field
                    </Button>
                  </>
                )}

                <Button variant="primary" type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FormDropdownModal;
