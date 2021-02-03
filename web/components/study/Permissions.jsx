import { useMutation } from '@apollo/client';
import { EDIT_STUDY } from '../../mutations/study';
import { useState, useRef } from 'react';
import { Card, Form, Button, Overlay, Tooltip } from 'react-bootstrap';
import { Formik } from 'formik';
import styles from '../../styles/studies.module.scss';

const PermissionsCard = ({ study }) => {
    const [editStudy] = useMutation(EDIT_STUDY);
    const [showTooltip, setShowTooltip] = useState(false);
    const buttonRef = useRef(null);
    // const permLevel = {
    //     0:"Co-Researcher",
    //     1:"Researcher",
    //     2:"Admin"
    // }

    const updateStudy = ({ create, edit, del }) => {
        const variables = {
            studyID: study.id,
            permissions: { create: parseInt(create), edit: parseInt(edit), delete: parseInt(del) }
        };

        editStudy({ variables });
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
    };

    return (
        <Card className={styles.permissionsCard}>
            <Card.Header>Study Permissions</Card.Header>
            <Formik
                initialValues={{
                    create: study.permissions.create,
                    edit: study.permissions.edit,
                    del: study.permissions.delete
                }}
                onSubmit={updateStudy}>
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                    <Form onSubmit={handleSubmit} className={styles.studyInfoForm}>
                        <Form.Group>
                            <Form.Label>Minimum level for create:</Form.Label>
                            <Form.Control
                                as="select"
                                name="create"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.create}>
                                <option value="0">Co-researcher</option>
                                <option value="1">Researcher</option>
                                <option value="2">Lab manager/Admin</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Minimum level for edit:</Form.Label>
                            <Form.Control
                                as="select"
                                name="edit"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.edit}>
                                <option value="0">Co-researcher</option>
                                <option value="1">Researcher</option>
                                <option value="2">Lab manager/Admin</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Minimum level for delete:</Form.Label>
                            <Form.Control
                                as="select"
                                name="del"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.del}>
                                <option value="0">Co-researcher</option>
                                <option value="1">Researcher</option>
                                <option value="2">Lab manager/Admin</option>
                            </Form.Control>
                        </Form.Group>
                        <Button ref={buttonRef} type="submit" className={styles.submitButton}>
                            Save
                        </Button>
                        <Overlay target={buttonRef.current} show={showTooltip} placement="bottom">
                            {(props) => <Tooltip {...props}>Permissions saved!</Tooltip>}
                        </Overlay>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default PermissionsCard;
