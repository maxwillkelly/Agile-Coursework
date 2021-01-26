import { Form, Container, Card, FormControl } from 'react-bootstrap';
import { Formik } from 'formik';

const Question = ({ question }) => {
    return (
        <Container>
            <Card>
                <Formik
                    initialValues={{ title: question.title, description: question.description }}>
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
                            <FormControl
                                type="text"
                                name="title"
                                placeholder={question.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.title}
                            />
                            <FormControl
                                type="text"
                                name="description"
                                placeholder="Enter a description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                            />
                            {question.options.map((option, index) => (
                                <Form.Check
                                    type={question.type}
                                    id="something"
                                    label={option}
                                    key={index}
                                />
                            ))}
                        </Form>
                    )}
                </Formik>
            </Card>
        </Container>
    );
};

export default Question;
