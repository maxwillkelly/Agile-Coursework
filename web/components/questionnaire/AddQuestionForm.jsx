import { Form, Button, Container, Card } from 'react-bootstrap';
import { Formik } from 'formik';

const AddQuestionForm = () => {
    return (
        <Container>
            <Card>
                <Formik initialValues={{ title: '', description: '' }}>
                    {({
                        values,
                        // errors,
                        // touched,
                        handleChange,
                        handleBlur,
                        // handleSubmit,
                        isSubmitting
                    }) => (
                        // {console.log(values)}
                        <div>
                            <Form.Group>
                                <Form.Label>Question Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="title"
                                    placeholder="Enter a title"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.title}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Question Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    placeholder="Enter a description"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={isSubmitting}>
                                Add
                            </Button>
                        </div>
                    )}
                </Formik>
            </Card>
        </Container>
    );
};

export default AddQuestionForm;
