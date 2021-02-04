import { Formik } from 'formik';
import { Card, Form, Button, Overlay, Tooltip } from 'react-bootstrap';
import { useState, useRef } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_STUDY } from '../../mutations/study';
import styles from '../../styles/studies.module.scss';

const StudyInfo = ({ data: { id, title, description } }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const buttonRef = useRef(null);
    const [editStudy] = useMutation(EDIT_STUDY);

    const updateStudy = (studyValues) => {
        const variables = {
            studyID: studyValues.id,
            title: studyValues.title,
            description: studyValues.description
        };
        editStudy({ variables })
            // .then((res) => {
            //     console.log('akjsdalksdjlaskdjasd' + res);
            // })
            .catch((err) => console.error(err));
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
    };

    return (
        <>
            <Card className={styles.studyCard}>
                <Card.Header>Study Information</Card.Header>
                <Formik
                    initialValues={{
                        id,
                        title,
                        description
                    }}
                    onSubmit={updateStudy}>
                    {({ values, handleChange, handleBlur, handleSubmit }) => (
                        <Form onSubmit={handleSubmit} className={styles.studyInfoForm}>
                            <Form.Label>Study Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                placeholder="Enter a title"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.title}
                            />
                            <Form.Label className={styles.studyDescriptionLabel}>
                                Study Description
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                placeholder="Enter a description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                            />
                            <Button ref={buttonRef} type="submit" className={styles.submitButton}>
                                Save
                            </Button>
                            <Overlay
                                target={buttonRef.current}
                                show={showTooltip}
                                placement="bottom">
                                {(props) => <Tooltip {...props}>Study saved!</Tooltip>}
                            </Overlay>
                        </Form>
                    )}
                </Formik>
            </Card>
        </>
    );
};

export default StudyInfo;
