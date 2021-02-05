import { useState, useRef } from 'react';
import { Button, Form, Card, InputGroup, Overlay, Tooltip } from 'react-bootstrap';
import { Draggable } from 'react-beautiful-dnd';
import { useMutation } from '@apollo/client';
import { EDIT_QUESTION, REMOVE_QUESTION_FROM_QUESTIONNAIRE } from '../../mutations/questionnaire';
import { Formik, FieldArray } from 'formik';
import styles from '../styles/questionnaire.module.scss';

const QuestionDraggable = ({ question, index, questionnaire, refetch }) => {
    return (
        <Draggable draggableId={question.qID} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}>
                    <Question question={question} questionnaire={questionnaire} refetch={refetch} />
                </div>
            )}
        </Draggable>
    );
};

const QuestionInfo = ({ question, handleChange, handleBlur, values }) => {
    return (
        <>
            <Form.Label>{question.qType === 'paragraph' ? 'Heading' : 'Question Title'}</Form.Label>
            <Form.Control
                type="text"
                name="title"
                placeholder="Enter a title"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.title}
            />
            <Form.Label className={styles.questionLabel}>
                {question.qType === 'paragraph' ? 'Paragraph' : 'Question Description'}
            </Form.Label>
            <Form.Control
                type="text"
                name="description"
                placeholder="Enter a description"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.description}
            />
            {question.qType !== 'paragraph' && (
                <>
                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            name="required"
                            id="yes"
                            label="An answer to this question is required"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value="yes"
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Question Type</Form.Label>
                        <Form.Control
                            as="select"
                            name="qType"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.qType}>
                            <option value="radio">Single choice (Radio)</option>
                            <option value="checkbox">Multiple choice (Checkbox)</option>
                            <option value="short">Short answer</option>
                            <option value="long">Long answer</option>
                        </Form.Control>
                    </Form.Group>
                </>
            )}
        </>
    );
};

const Question = ({ question, questionnaire, refetch }) => {
    const [editQuestion] = useMutation(EDIT_QUESTION);
    const [removeQuestionFromQuestionnaire] = useMutation(REMOVE_QUESTION_FROM_QUESTIONNAIRE);
    const [showTooltip, setShowTooltip] = useState(false);
    const buttonRef = useRef(null);

    const deleteQuestion = async () => {
        await removeQuestionFromQuestionnaire({
            variables: { questionnaireID: questionnaire.id, questionID: question.qID }
        });
        refetch();
    };

    const updateQuestion = async (questionValues) => {
        const variables = {
            questionnaireID: questionnaire.id,
            questionID: question.qID,
            qType: questionValues.qType,
            order: questionValues.order,
            message: questionValues.title,
            description: questionValues.description,
            values: questionValues.questionOptions
        };
        await editQuestion({ variables });
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
        refetch();
    };

    return (
        <Card className={styles.questionCard}>
            <Card.Header>
                <span className={styles.questionType}>
                    {question.qType === 'paragraph'
                        ? `${question.order + 1}: Text Section`
                        : `${question.order + 1}: Question`}
                </span>
                <Button variant="danger" className={styles.deleteButton} onClick={deleteQuestion}>
                    Delete
                </Button>
            </Card.Header>
            <div className={styles.questionCardForm}>
                <Formik
                    initialValues={{
                        title: question.message,
                        description: question.description,
                        questionOptions: question.values,
                        order: question.order,
                        qType: question.qType,
                        required: null
                    }}
                    onSubmit={updateQuestion}>
                    {({
                        values,
                        // errors,
                        // touched,
                        handleChange,
                        handleBlur,
                        handleSubmit
                        // isSubmitting
                    }) => (
                        <Form onSubmit={handleSubmit}>
                            <QuestionInfo
                                question={question}
                                handleChange={handleChange}
                                handleBlur={handleBlur}
                                values={values}
                            />
                            {(question.qType === 'radio' || question.qType === 'checkbox') &&
                                values.questionOptions && (
                                    <QuestionOptions
                                        buttonRef={buttonRef}
                                        handleChange={handleChange}
                                        handleBlur={handleBlur}
                                        question={question}
                                        values={values}
                                    />
                                )}

                            {(question.qType === 'short' ||
                                question.qType === 'long' ||
                                question.qType === 'paragraph') && (
                                <Button
                                    ref={buttonRef}
                                    type="submit"
                                    className={styles.submitButton}>
                                    Save
                                </Button>
                            )}
                            <Overlay
                                target={buttonRef.current}
                                show={showTooltip}
                                placement="bottom">
                                {(props) => <Tooltip {...props}>Question saved!</Tooltip>}
                            </Overlay>
                        </Form>
                    )}
                </Formik>
            </div>
        </Card>
    );
};

const QuestionOptions = ({ question, values, handleChange, handleBlur, buttonRef }) => (
    <>
        <Form.Label className={styles.questionLabel}>Question Options</Form.Label>
        <FieldArray name="questionOptions">
            {(arrayHelpers) => {
                return (
                    <>
                        {values.questionOptions.map((option, index) => (
                            // <div className={styles.checkboxContainer}>
                            <InputGroup className={styles.questionOption} key={index}>
                                <InputGroup.Prepend>
                                    <QuestionPrepend question={question} />
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="text"
                                    name={`questionOptions.${index}`}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={option}
                                    key={index}
                                />
                                <InputGroup.Append>
                                    <Button
                                        variant="danger"
                                        onClick={() => arrayHelpers.remove(index)}>
                                        Delete
                                    </Button>
                                </InputGroup.Append>
                            </InputGroup>
                            // </div>
                        ))}
                        <div className={styles.questionCardButtons}>
                            <Button
                                className={styles.addOptionButton}
                                variant="success"
                                onClick={() => arrayHelpers.push('')}>
                                Add option
                            </Button>
                            <Button ref={buttonRef} type="submit">
                                Save
                            </Button>
                        </div>
                        {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                    </>
                );
            }}
        </FieldArray>
    </>
);

const QuestionPrepend = ({ question }) => {
    switch (question.qType) {
        case 'checkbox':
            return <InputGroup.Text>☐</InputGroup.Text>;
        case 'radio':
            return <InputGroup.Text>O</InputGroup.Text>;
        default:
            return null;
    }
};

export default QuestionDraggable;
