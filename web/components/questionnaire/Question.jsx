import { Button, ButtonGroup, Form, Container, Card, InputGroup } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { EDIT_QUESTION, REMOVE_QUESTION_FROM_QUESTIONNAIRE } from '../../mutations/questionnaire';
import { Formik, FieldArray } from 'formik';
// import styles from '../styles/questionnaire.module.scss';

const Question = ({ question, questionnaire, refetch }) => {
    const [editQuestion] = useMutation(EDIT_QUESTION);
    const [removeQuestionFromQuestionnaire] = useMutation(REMOVE_QUESTION_FROM_QUESTIONNAIRE);

    const deleteQuestion = async () => {
        await removeQuestionFromQuestionnaire({
            variables: { questionnaireID: questionnaire.id, questionID: question.qID }
        });
        refetch();
    };
    const updateQuestion = (questionValues) => {
        const variables = {
            questionnaireID: questionnaire.id,
            questionID: question.qID,
            qType: question.qType,
            order: questionValues.order,
            message: questionValues.title,
            description: questionValues.description,
            values: questionValues.questionOptions
        };
        editQuestion({ variables });
    };

    return (
        <Container>
            <Card className="p-0 m-5">
                <Card.Header>
                    Question
                    <Button variant="danger" className="float-right" onClick={deleteQuestion}>
                        Delete
                    </Button>
                </Card.Header>
                <div className="m-4">
                    <Formik
                        initialValues={{
                            title: question.message,
                            description: question.description,
                            questionOptions: question.values,
                            order: question.order
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
                                <Form.Label>Question Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    placeholder="Enter a title"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.title}
                                />
                                <Form.Label className="mt-3">Question Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    placeholder="Enter a description"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                />

                                {(question.qType === 'radio' || question.qType === 'checkbox') &&
                                    values.questionOptions && (
                                        <>
                                            <Form.Label className="mt-3">
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
                                                                        className="my-3"
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
                                                            <ButtonGroup className="mt-3 float-right">
                                                                <Button
                                                                    className="mr-2"
                                                                    variant="success"
                                                                    onClick={() =>
                                                                        arrayHelpers.push('')
                                                                    }>
                                                                    Add option
                                                                </Button>
                                                                <Button type="submit">Save</Button>
                                                            </ButtonGroup>
                                                            {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                                                        </>
                                                    );
                                                }}
                                            </FieldArray>
                                        </>
                                    )}
                                {(question.qType === 'short' || question.qType === 'long') && (
                                    <Form.Label className="mt-3">
                                        Question Type:
                                        {question.qType === 'short'
                                            ? ' Short answer'
                                            : ' Long answer'}
                                    </Form.Label>
                                )}
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
