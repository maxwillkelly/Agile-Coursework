import { Button, ButtonGroup, Form, Container, Card, InputGroup } from 'react-bootstrap';
import { Formik, FieldArray } from 'formik';
// import styles from '../styles/questionnaire.module.scss';

const Question = ({ question }) => {
    return (
        <Container>
            <Card className="p-4 m-5">
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
                                placeholder={question.title}
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
                                            {values.questionOptions.map((option, index) => (
                                                // <div className={styles.checkboxContainer}>
                                                <InputGroup className="my-3" key={index}>
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
            </Card>
        </Container>
    );
};

const QuestionPrepend = ({ question }) => {
    switch (question.type) {
        case 'checkbox':
            // return <InputGroup.Text>☐</InputGroup.Text>;
            return <InputGroup.Text>square</InputGroup.Text>;
        case 'radio':
            // return <InputGroup.Text>🔘</InputGroup.Text>;
            return <InputGroup.Text>circle</InputGroup.Text>;
        default:
            return null;
    }
};

export default Question;
