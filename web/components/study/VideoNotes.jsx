import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Col, ListGroup, Modal, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import Spinner from '../Spinner';
import { GET_STUDY_NOTES } from '../../queries/video';
import { CREATE_VIDEO_NOTE } from '../../mutations/video';

const VideoNotesList = ({ studyID }) => {
    const { loading, error, data } = useQuery(GET_STUDY_NOTES, { variables: { studyID } });

    if (loading) return <Spinner />;
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
    if (data)
        return (
            <div className="py-5 mb-5">
                <h5>Video Groups</h5>
                <ListGroup>
                    {data.getStudyNotes.map((studyNote) => (
                        <VideoNotesItem
                            studyID={studyID}
                            studyNote={studyNote}
                            key={studyNote._id}
                        />
                    ))}
                </ListGroup>
                <CreateVideoGroup studyID={studyID} />
            </div>
        );
};

const VideoNotesItem = ({ studyID, studyNote }) => {
    const router = useRouter();
    const { title } = studyNote;
    return (
        <ListGroup.Item>
            <div className="d-flex align-items-center">
                <Col>
                    <p className="m-0">{title}</p>
                </Col>
                <Button
                    variant="primary"
                    onClick={() => router.push(`/studies/${studyID}/videos/${studyNote._id}`)}>
                    View
                </Button>
            </div>
        </ListGroup.Item>
    );
};

export const CreateVideoGroup = ({ studyID }) => {
    const [showModal, setShowModal] = useState(false);
    const [createVideoNote] = useMutation(CREATE_VIDEO_NOTE);

    const handleClose = () => setShowModal(false);

    const validationSchema = yup.object({
        title: yup.string().required().max(128),
        videos: yup.array().of(
            yup.object().shape({
                title: yup.string().required().max(128),
                link: yup.string().required(),
                type: 'direct'
            })
        )
    });

    const submitVideoNote = async (videoNotes, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        await createVideoNote({ variables: { studyID, videoNotes } });
        resetForm();
        setSubmitting(false);
        handleClose();
    };

    return (
        <>
            <Button
                className="float-right mt-3 mb-5"
                variant="primary"
                onClick={() => setShowModal(true)}>
                Create Video Group
            </Button>

            <Formik
                initialValues={{
                    title: '',
                    videos: [{ title: '', link: '', type: 'direct' }]
                }}
                validateSchema={validationSchema}
                onSubmit={submitVideoNote}>
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting
                }) => (
                    <Modal show={showModal} onHide={handleClose} animation={false}>
                        <Form onSubmit={handleSubmit}>
                            <Modal.Header closeButton>
                                <Modal.Title>Create New Video Group</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form.Group>
                                    <Form.Label>Video Group Title</Form.Label>
                                    <Form.Control
                                        name="title"
                                        type="text"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.title}
                                        isInvalid={touched.title && errors.title}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.title}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Video Title</Form.Label>
                                    <Form.Control
                                        name="videos[0].title"
                                        type="text"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.videos[0].title}
                                        // isInvalid={
                                        //     touched.videos[0].title && errors.videos[0].title
                                        // }
                                    />
                                    {/* <Form.Control.Feedback type="invalid">
                                        {errors.videos[0].title}
                                    </Form.Control.Feedback> */}
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Video Link</Form.Label>
                                    <Form.Control
                                        name="videos[0].link"
                                        type="text"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.videos[0].link}
                                        // isInvalid={touched.videos[0].link && errors.videos[0].link}
                                    />
                                    {/* <Form.Control.Feedback type="invalid">
                                        {errors.videos[0].link}
                                    </Form.Control.Feedback> */}
                                </Form.Group>
                                <pre>{JSON.stringify(values, null, 2)}</pre>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Form>
                    </Modal>
                )}
            </Formik>
        </>
    );
};

export default VideoNotesList;
