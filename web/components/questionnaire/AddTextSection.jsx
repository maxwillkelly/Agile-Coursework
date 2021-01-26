import { Form, Button, Container, Card } from 'react-bootstrap';
import { Formik } from 'formik';

const AddTextSection = () => {
    return (
        <Container>
            <Card>
                <Formik initialValues={{ heading: '', paragraph: '' }}>
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
                                <Form.Label>Heading</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="heading"
                                    placeholder="Enter a heading"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.heading}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Paragraph</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="paragraph"
                                    placeholder="Type your text here"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.paragraph}
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

export default AddTextSection;
