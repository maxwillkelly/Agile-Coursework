import { Form, Button, Container, Card } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { Formik } from 'formik';
import { ADD_QUESTION } from '../mutations/questionnaire';
import styles from '../styles/questionnaire.module.scss';

const AddQuestionForm = ({ questionnaire }) => {
    const [addQuestion] = useMutation(ADD_QUESTION);

    const submitValues = (variables) => {
        addQuestion({ variables: { questionnaireID: questionnaire.id, question: variables } });
    };

    return (
        <Container className={`${styles.questionnaireContainer}`}>
            <Card className={`${styles.questionnaireCard} p-4`}>
                <Formik
                    initialValues={{
                        message: '',
                        description: '',
                        qType: ''
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
                        // {console.log(values)
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Question Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="message"
                                    placeholder="Enter a title"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.message}
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
                                    name="qType"
                                    label="Single choice (Radio)"
                                    id="radio"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value="radio"
                                />
                                <Form.Check
                                    type="radio"
                                    name="qType"
                                    id="checkbox"
                                    label="Multiple choice (Checkbox)"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value="checkbox"
                                />
                                <Form.Check
                                    type="radio"
                                    name="qType"
                                    id="short"
                                    label="Short answer"
                                />
                                <Form.Check
                                    type="radio"
                                    name="qType"
                                    id="long"
                                    label="Long answer"
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Add
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Card>
        </Container>
    );
};

export default AddQuestionForm;
