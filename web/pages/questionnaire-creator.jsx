import Head from 'next/head';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { Formik } from 'formik';
// import styles from '../styles/questionnaire-creator.module.scss';

const QuestionnaireTitleForm = () => {
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
                            <Button variant="primary" type="submit" disabled={isSubmitting}>
                                Save
                            </Button>
                        </div>
                    )}
                </Formik>
            </Card>
        </Container>
    );
};

export default function QuestionairreCreatorPage() {
    return (
        <div>
            <Head>
                <title>Create a Questionnaire</title>
                <link rel="icon" href="favivon.ico" />
            </Head>

            <main>
                <QuestionnaireTitleForm />
            </main>
        </div>
    );
}
