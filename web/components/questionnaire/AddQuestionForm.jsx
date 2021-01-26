import { Form, Button, Container, Card } from 'react-bootstrap';
import { Formik } from 'formik';

const AddQuestionForm = () => {
    return (
        <Container>
            <Card>
                <Formik initialValues={{ title: '', description: '', questiontype: '' }}>
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

                            <Form.Group>
                                <Form.Label>Question type</Form.Label>
                                <Form.Check
                                    type="radio"
                                    id="questiontype"
                                    label="Single choice (Radio)"
                                />
                                <Form.Check
                                    type="radio"
                                    id="questiontype"
                                    label="Multiple choice (Checkbox)"
                                />
                                <Form.Check type="radio" id="questiontype" label="Short answer" />
                                <Form.Check type="radio" id="questiontype" label="Long answer" />
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
