import { Form, Button, Container, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import lodash from 'lodash';
import styles from '../styles/questionnaire.module.scss';

const AddQuestionForm = ({ onQuestionSet }) => {
    const submitValues = (values, onQuestionSet) => {
        onQuestionSet((state) => {
            console.log(state);
            const copy = lodash.cloneDeep(state);
            values.options = [''];
            copy.push(values);
            console.log(copy);
            return copy;
        });
    };

    return (
        <Container className={`${styles.questionnaireContainer}`}>
            <Card className={`${styles.questionnaireCard} p-4`}>
                <Formik
                    initialValues={{ title: '', description: '', type: '' }}
                    onSubmit={(values) => submitValues(values, onQuestionSet)}>
                    {({
                        values,
                        // errors,
                        // touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) => (
                        // {console.log(values)
                        <Form onSubmit={handleSubmit}>
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
                                    name="type"
                                    label="Single choice (Radio)"
                                    id="radio"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value="radio"
                                />
                                <Form.Check
                                    type="radio"
                                    name="type"
                                    id="checkbox"
                                    label="Multiple choice (Checkbox)"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value="checkbox"
                                />
                                <Form.Check
                                    type="radio"
                                    name="type"
                                    id="short"
                                    label="Short answer"
                                />
                                <Form.Check
                                    type="radio"
                                    name="type"
                                    id="long"
                                    label="Long answer"
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" disabled={isSubmitting}>
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
