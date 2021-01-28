import { Form, Button, Container, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import styles from '../styles/questionnaire.module.scss';

const AddTextSection = () => {
    return (
        <Container className={`${styles.questionnaireContainer}`}>
            <Card className={`${styles.questionnaireCard} p-4`}>
                <Formik initialValues={{ heading: '', paragraph: '' }}>
                    {({
                        values,
                        // errors,
                        // touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) => (
                        // {console.log(values)}
                        <Form onSubmit={handleSubmit}>
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

                            <Button className="float-right" variant="primary" type="submit">
                                Add
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Card>
        </Container>
    );
};

export default AddTextSection;
