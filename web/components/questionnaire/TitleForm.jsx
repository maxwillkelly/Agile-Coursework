import { Form, Button, Container, Card } from 'react-bootstrap';
import { Formik } from 'formik';
import { useMutation } from '@apollo/client';
import { EDIT_QUESTIONNAIRE } from '../../mutations/questionnaire';
import styles from '../styles/questionnaire.module.scss';

const TitleForm = ({ questionnaire }) => {
    const [editQuestionnaire] = useMutation(EDIT_QUESTIONNAIRE);

    const updateValues = async (variables) => {
        editQuestionnaire({ variables });
    };

    return (
        <Container className={`${styles.questionnaireContainer}`}>
            <Card className={`${styles.questionnaireCard} p-4`}>
                <Formik
                    initialValues={{
                        questionnaireID: questionnaire.id,
                        title: questionnaire.title,
                        description: questionnaire.description
                    }}
                    onSubmit={updateValues}>
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
                                <Form.Label>Questionnaire Title</Form.Label>
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
                                <Form.Label>Questionnaire Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    placeholder="Enter a description"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                />
                            </Form.Group>
                            <Button className="float-right" variant="primary" type="submit" disabled={isSubmitting}>
                                Save
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Card>
        </Container>
    );
};

export default TitleForm;
