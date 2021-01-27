import { Button, ButtonGroup, Form, Container, Card, InputGroup } from 'react-bootstrap';
import { Formik, FieldArray } from 'formik';
import lodash from 'lodash';
// import styles from '../styles/questionnaire.module.scss';

const Question = ({ question, onQuestionSet }) => {
    const deleteQuestion = () => {
        onQuestionSet((state) => {
            console.log(state);
            const copy = lodash.cloneDeep(state);
            copy.pop();
            console.log(copy);
            return copy;
        });
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
                            title: question.title,
                            description: question.description,
                            questionOptions: question.options
                        }}>
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

                                <Form.Label className="mt-3">Question Options</Form.Label>
                                <FieldArray name="questionOptions">
                                    {(arrayHelpers) => {
                                        return (
                                            <>
                                                {values.questionOptions &&
                                                    values.questionOptions.map((option, index) => (
                                                        // <div className={styles.checkboxContainer}>
                                                        <InputGroup className="my-3" key={index}>
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
                                                                        arrayHelpers.remove(index)
                                                                    }>
                                                                    Delete
                                                                </Button>
                                                            </InputGroup.Append>
                                                        </InputGroup>
                                                        // </div>
                                                    ))}
                                                <ButtonGroup className="mt-3 float-right">
                                                    <Button
                                                        className="mr-2"
                                                        variant="success"
                                                        onClick={() => arrayHelpers.push('')}>
                                                        Add option
                                                    </Button>
                                                    <Button type="submit">Save</Button>
                                                </ButtonGroup>
                                                {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
                                            </>
                                        );
                                    }}
                                </FieldArray>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Card>
        </Container>
    );
};

const QuestionPrepend = ({ question }) => {
    switch (question.type) {
        case 'checkbox':
            return <InputGroup.Text>☐</InputGroup.Text>;
        case 'radio':
            return <InputGroup.Text>O</InputGroup.Text>;
        default:
            return null;
    }
};

export default Question;
