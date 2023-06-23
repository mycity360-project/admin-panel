import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { MdDelete } from "react-icons/md";

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
  const [formValues, setFormValues] = useState({});
  formFields.forEach((field) => {
    const { name, defaultValue } = field;
    formValues[name] = defaultValue ?? "";
  });

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

  const [areaOrQuestionFieldValue, setAreaOrQuestionFieldValue] = useState(
    formValues[areaOrQuestionInputFieldData.name]
  );
  const [sequenceOrPincodeFieldValue, setSequenceOrPincodeFieldValue] =
    useState(formValues[sequenceOrPincodeFieldData.name]);
  const [dropdownQuestValues, setDropdownQuestValues] = useState(
    questionDropdownData.options || [""]
  );
  const [showSecondDropdown, setShowSecondDropdown] = useState(false);

  useEffect(() => {
    setFirstDropdownData(formFields[0]);
    setSecondDropdownData(formFields[1]);
    SetAreaOrQuestionInputFieldData(formFields[2]);
    if (isFromQuestion) {
      setSequenceOrPincodeFieldData(formFields[3]);
      setThirdDropdownData(formFields[4]);
      setQuestionDropdownData(formFields[5]);
    }
    console.log(
      formValues[areaOrQuestionInputFieldData.name],
      isFromQuestion,
      "first"
    );
  }, [formFields, isFromQuestion]);

  useEffect(() => {
    if (secondDropdownData.options?.length) {
      setShowSecondDropdown(true);
    }
    console.log(formValues[areaOrQuestionInputFieldData.name], "second");
  }, [secondDropdownData]);

  const handleOptionSelectFirstDropdown = (event) => {
    setShowSecondDropdown(false);
    const selectedId = event.target.value;
    handleSecondDropdownData(parseInt(selectedId));
    const selectedItem = firstDropdownData.options.find(
      (option) => option.id === parseInt(selectedId)
    );
    setFirstDropdownSelectedData(selectedItem);
  };

  const handleOptionSelectSecondDropdown = (event) => {
    const selectedId = event.target.value;
    const selectedItem = secondDropdownData.options.find(
      (option) => option.id === parseInt(selectedId)
    );
    setSecondDropdownSelectedData(selectedItem);
  };

  const handleOptionSelectThirdDropdown = (event) => {
    const selectedValue = event.target.value;
    setThirdDropdownSelectedData(selectedValue);
  };

  const handleAddInputField = () => {
    setDropdownQuestValues([...dropdownQuestValues, ""]);
  };

  const handleDeleteInputField = (index) => {
    const updatedValues = [...dropdownQuestValues];
    updatedValues.splice(index, 1);
    setDropdownQuestValues(updatedValues);
  };
  const handleareaOrQuestionFieldChange = (event) => {
    setAreaOrQuestionFieldValue(event.target.value);
  };

  const handlesequenceOrPincodeFieldChange = (event) => {
    setSequenceOrPincodeFieldValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const filteredEntries = Array.from(formData.entries()).filter(([key]) =>
      [
        areaOrQuestionInputFieldData.name,
        sequenceOrPincodeFieldData.name,
      ].includes(key)
    );
    const values = Object.fromEntries(filteredEntries);

    const dropdownValues = {
      [firstDropdownData.name]:
        firstDropdownSelectedData || formValues[firstDropdownData.name],
      [secondDropdownData.name]:
        secondDropdownSelectedData || formValues[secondDropdownData.name],
      [thirdDropdownData.name]:
        thirdDropdownSelectedData || formValues[thirdDropdownData.name],
    };
    let formResp;
    isFromQuestion
      ? (formResp = {
          ...values,
          ...dropdownValues,
          [questionDropdownData.name]: dropdownQuestValues,
        })
      : (formResp = { ...values, ...dropdownValues });
    console.log(formResp);
    formSubmitHandler(event, formResp);
  };

  return (
    <div>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{modalHeading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group
              controlId={firstDropdownData.name}
              key={firstDropdownData.name}
              style={{ padding: 5 }}
            >
              <Form.Label>{firstDropdownData.label}</Form.Label>
              <Form.Select
                id={firstDropdownData.name}
                size="sm"
                onChange={handleOptionSelectFirstDropdown}
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
                  onChange={handleOptionSelectSecondDropdown}
                  value={
                    secondDropdownSelectedData
                      ? secondDropdownSelectedData?.id
                      : secondDropdownData.defaultValue?.id
                  }
                >
                  <option value="">Select {secondDropdownData.label}</option>
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
                value={areaOrQuestionFieldValue}
                onChange={(event) => handleareaOrQuestionFieldChange(event)}
              />
              <Form.Control.Feedback type="invalid">
                {/* {errors[areaOrQuestionInputFieldData.name]} */}
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
                value={sequenceOrPincodeFieldValue}
                onChange={(event) => handlesequenceOrPincodeFieldChange(event)}
                // onBlur={handleBlur}
                // isInvalid={
                //   touched[sequenceOrPincodeFieldData.name] &&
                //   errors[sequenceOrPincodeFieldData.name]
                // }
              />
              <Form.Control.Feedback type="invalid">
                {/* {errors[sequenceOrPincodeFieldData.name]} */}
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
                  onChange={handleOptionSelectThirdDropdown}
                  value={
                    thirdDropdownSelectedData || thirdDropdownData.defaultValue
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
            {(thirdDropdownSelectedData === "Dropdown" ||
              formValues[thirdDropdownData.name] === "Dropdown") && (
              <>
                <Form.Label>Enter {questionDropdownData.label}</Form.Label>
                <Row>
                  <Col>
                    {dropdownQuestValues?.map((inputValue, index) => {
                      return (
                        <div key={index}>
                          <Form.Group>
                            <Form.Control
                              size="sm"
                              type="text"
                              name={`${dropdownQuestValues.name}[${index}]`}
                              value={inputValue}
                              onChange={(event) => {
                                let updatedValues = [...dropdownQuestValues];
                                updatedValues[index] = event.target.value;
                                setDropdownQuestValues(updatedValues);
                              }}
                            />
                          </Form.Group>
                          <MdDelete
                            color="#333"
                            size={20}
                            cursor="pointer"
                            style={{ marginLeft: "10px" }}
                            onMouseEnter={(e) => {
                              e.target.style.color = "red";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = "#333";
                            }}
                            onClick={() => handleDeleteInputField(index)}
                          />
                        </div>
                      );
                    })}
                  </Col>
                </Row>
                <Button
                  className="float-right"
                  variant="success"
                  size="sm"
                  onClick={handleAddInputField}
                >
                  Add Input Field
                </Button>
              </>
            )}
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FormDropdownModal;
