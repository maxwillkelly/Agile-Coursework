import { Form, Button, Container, Card } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { Formik } from 'formik';
import { ADD_QUESTION } from '../../mutations/questionnaire';
import styles from '../styles/questionnaire.module.scss';

const AddTextSection = ({ questionnaire, refetch }) => {
    const [addQuestion] = useMutation(ADD_QUESTION);

    const submitValues = async (variables) => {
        await addQuestion({
            variables: { questionnaireID: questionnaire.id, question: variables }
        });
        refetch();
    };
    return (
        <Container className={styles.questionnaireContainer}>
            <Card className={styles.questionnaireCard}>
                <Card.Header>Add Text Section</Card.Header>
                <Card.Body>
                    <Formik
                        initialValues={{
                            message: '',
                            description: '',
                            qType: 'paragraph',
                            order: questionnaire.questions.length,
                            values: []
                        }}
                        onSubmit={submitValues}>
                        {({
                            values,
                            // errors,
                            // touched,
                            handleChange,
                            handleBlur,
                            handleSubmit
                        }) => (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group>
                                    <Form.Label>Heading</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="message"
                                        placeholder="Enter a heading"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.message}
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Paragraph</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="description"
                                        placeholder="Type your text here"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.description}
                                    />
                                </Form.Group>

                                <Button
                                    className={styles.submitButton}
                                    variant="primary"
                                    type="submit">
                                    Add
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AddTextSection;
