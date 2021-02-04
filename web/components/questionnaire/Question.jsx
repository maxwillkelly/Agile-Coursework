import { useState, useRef } from 'react';
import { Button, Form, Container, Card, InputGroup, Overlay, Tooltip } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { EDIT_QUESTION, REMOVE_QUESTION_FROM_QUESTIONNAIRE } from '../../mutations/questionnaire';
import { Formik, FieldArray } from 'formik';
import styles from '../styles/questionnaire.module.scss';

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
            qType: question.qType,
            order: questionValues.order,
            message: questionValues.title,
            description: questionValues.description,
            values: questionValues.questionOptions
        };
        await editQuestion({ variables });
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
    };

    return (
        <Container>
            <Card className={styles.questionCard}>
                <Card.Header>
                    {question.qType === 'paragraph' ? 'Text Section' : 'Question'}
                    <Button
                        variant="danger"
                        className={styles.submitButton}
                        onClick={deleteQuestion}>
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
                                <Form.Label>
                                    {question.qType === 'paragraph' ? 'Heading' : 'Question Title'}
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    placeholder="Enter a title"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.title}
                                />
                                <Form.Label className={styles.questionLabel}>
                                    {question.qType === 'paragraph'
                                        ? 'Paragraph'
                                        : 'Question Description'}
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
                                    <Form.Check
                                        type="checkbox"
                                        name="required"
                                        id="yes"
                                        label="An answer to this question is required"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value="yes"
                                    />
                                )}
                                {(question.qType === 'radio' || question.qType === 'checkbox') &&
                                    values.questionOptions && (
                                        <>
                                            <Form.Label className={styles.questionLabel}>
                                                Question Options
                                            </Form.Label>
                                            <FieldArray name="questionOptions">
                                                {(arrayHelpers) => {
                                                    return (
                                                        <>
                                                            {values.questionOptions.map(
                                                                (option, index) => (
                                                                    // <div className={styles.checkboxContainer}>
                                                                    <InputGroup
                                                                        className={
                                                                            styles.questionOption
                                                                        }
                                                                        key={index}>
                                                                        <InputGroup.Prepend>
                                                                            <QuestionPrepend
                                                                                question={question}
                                                                            />
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
                                                                                onClick={() =>
                                                                                    arrayHelpers.remove(
                                                                                        index
                                                                                    )
                                                                                }>
                                                                                Delete
                                                                            </Button>
                                                                        </InputGroup.Append>
                                                                    </InputGroup>
                                                                    // </div>
                                                                )
                                                            )}
                                                            <div
                                                                className={
                                                                    styles.questionCardButtons
                                                                }>
                                                                <Button
                                                                    className={
                                                                        styles.addOptionButton
                                                                    }
                                                                    variant="success"
                                                                    onClick={() =>
                                                                        arrayHelpers.push('')
                                                                    }>
                                                                    Add option
                                                                </Button>
                                                                <Button
                                                                    ref={buttonRef}
                                                                    type="submit">
                                                                    Save
                                                                </Button>
                                                            </div>
                                                            {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                                                        </>
                                                    );
                                                }}
                                            </FieldArray>
                                        </>
                                    )}
                                {(question.qType === 'short' ||
                                    question.qType === 'long' ||
                                    question.qType === 'paragraph') && (
                                    <>
                                        <Form.Label className={styles.questionLabel}>
                                            Question Type:
                                            {question.qType === 'short'
                                                ? ' Short answer'
                                                : ' Long answer'}
                                        </Form.Label>
                                        <Button
                                            ref={buttonRef}
                                            type="submit"
                                            className={styles.submitButton}>
                                            Save
                                        </Button>
                                    </>
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
        </Container>
    );
};

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

export default Question;
