import { useState, useRef } from 'react';
import { Form, Button, Container, Card, Overlay, Tooltip, Col } from 'react-bootstrap';
import { Formik } from 'formik';
import { useMutation } from '@apollo/client';
import { EDIT_QUESTIONNAIRE } from '../../mutations/questionnaire';
import styles from '../styles/questionnaire.module.scss';

const TitleForm = ({ questionnaire }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [editQuestionnaire] = useMutation(EDIT_QUESTIONNAIRE);
    const buttonRef = useRef(null);

    const updateValues = async (variables) => {
        await editQuestionnaire({ variables });
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
    };

    return (
        <Card className={styles.questionnaireCard}>
            <Card.Header>Your Questionnaire</Card.Header>
            <Card.Body>
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
                        handleSubmit
                    }) => (
                        // {console.log(values)}
                        <Form onSubmit={handleSubmit}>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        placeholder="Enter a title"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.title}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="description"
                                        placeholder="Enter a description"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.description}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Button
                                ref={buttonRef}
                                className={styles.submitButton}
                                variant="primary"
                                type="submit">
                                Save
                            </Button>
                            <Overlay
                                target={buttonRef.current}
                                show={showTooltip}
                                placement="bottom">
                                {(props) => <Tooltip {...props}>Questionnaire saved!</Tooltip>}
                            </Overlay>
                        </Form>
                    )}
                </Formik>
            </Card.Body>
        </Card>
    );
};

export default TitleForm;
