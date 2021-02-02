import Head from 'next/head';
import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';

import {
    Button,
    Card,
    Container,
    ListGroup,
    Overlay,
    Row,
    Col,
    Spinner,
    Form,
    Tooltip
} from 'react-bootstrap';
import { GET_STUDY } from '../../queries/study';
import { CREATE_QUESTIONNAIRE, REMOVE_QUESTIONNAIRE } from '../../mutations/questionnaire';
import { EDIT_STUDY, ADD_STAFF_TO_STUDY, REMOVE_STAFF_FROM_STUDY } from '../../mutations/study';
import { GET_STUDY_QUESTIONNAIRES, GET_CSV_OF_RESPONSES } from '../../queries/questionnaire';
import { USERS_QUERY } from '../../queries/users';
import Navigation from '../../components/Navigation';
import MainBreadcrumb from '../../components/MainBreadcrumb';
import { Formik } from 'formik';
import copy from 'copy-to-clipboard';
import styles from '../../styles/questionnaires.module.scss';

const StudyPage = () => {
    const router = useRouter();
    const studyID = router.query.studyId;
    const { loading, error, data, refetch } = useQuery(GET_STUDY, {
        variables: { id: studyID }
    });

    if (loading)
        return (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        );
    if (error) return null;
    if (data)
        return (
            <>
                <Head>
                    <title>Study</title>
                </Head>
                <Navigation />
                <MainBreadcrumb />
                <main>
                    <Container className="mt-3">
                        <Row className="mb-3">
                            <Col>
                                <StudyInfo data={data.getStudy} />
                            </Col>
                            <Col>
                                <AddStaffCard study={data.getStudy} />
                            </Col>
                        </Row>
                        <StaffList
                            staff={data.getStudy.staff}
                            studyID={studyID}
                            refetch={refetch}
                        />
                        <QuestionnairesSection studyID={studyID} />
                    </Container>
                </main>
            </>
        );
};

const StaffList = ({ staff, studyID, refetch }) => {
    return (
        <ListGroup>
            <ListGroup.Item>
                <div className="d-flex">
                    <Col>
                        <p className="m-0">Name</p>
                    </Col>
                    <Col>
                        <p className="m-0">Permission</p>
                    </Col>
                    <Col>
                        <p className="m-0">Email</p>
                    </Col>
                    <Col>
                        <p className="m-0">Remove</p>
                    </Col>
                </div>
            </ListGroup.Item>
            {staff.map((staffMember, index) => (
                <StaffMember
                    staffMember={staffMember}
                    key={index}
                    studyID={studyID}
                    refetch={refetch}
                />
            ))}
        </ListGroup>
    );
};

const StaffMember = ({ staffMember, studyID, refetch }) => {
    const [removeStaffFromStudy] = useMutation(REMOVE_STAFF_FROM_STUDY);

    const removeStaffMember = async () => {
        await removeStaffFromStudy({ variables: { staffID: staffMember.id, studyID } });
        refetch();
    };

    return (
        <ListGroup.Item>
            <div className="d-flex">
                <Col>
                    <p className="m-0">
                        {staffMember.firstName} {staffMember.lastName}
                    </p>
                </Col>
                <Col>
                    <p className="m-0">{staffMember.permission}</p>
                </Col>
                <Col>
                    <p className="m-0">{staffMember.email}</p>
                </Col>
                <Col>
                    <Button variant="danger" onClick={removeStaffMember}>
                        Remove
                    </Button>
                </Col>
            </div>
        </ListGroup.Item>
    );
};

const AddStaffCard = ({ study }) => {
    const { loading, error, data, refetch } = useQuery(USERS_QUERY);
    const [addStaff] = useMutation(ADD_STAFF_TO_STUDY);

    const addStaffMemberToStudy = async (variables) => {
        if (!variables.staffID) return;
        // console.log(variables);
        await addStaff({ variables });
        refetch();
    };

    if (loading)
        return (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        );
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

    return (
        <Card className="p-0 m-0">
            <Card.Header>Add a staff member</Card.Header>

            <Formik
                initialValues={{
                    studyID: study.id,
                    staffID: ''
                }}
                onSubmit={addStaffMemberToStudy}>
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                    <Form className="m-4" onSubmit={handleSubmit}>
                        <Form.Label>Choose a staff member</Form.Label>
                        <Form.Control
                            as="select"
                            name="staffID"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.staffID}>
                            <option value="">Choose...</option>
                            {data &&
                                data.getUsers
                                    .filter((user) => {
                                        for (const staffMember of study.staff) {
                                            if (staffMember.id === user.id) return false;
                                        }
                                        return true;
                                    })
                                    .map((user) => (
                                        <option
                                            key={user.id}
                                            value={
                                                user.id
                                            }>{`${user.firstName} ${user.lastName}`}</option>
                                    ))}
                        </Form.Control>
                        <Button
                            type="submit"
                            className="mt-3 float-right"
                            variant="success"
                            disabled={!values.staffID}>
                            Add
                        </Button>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

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
            <Card className="p-0 m-0">
                <Card.Header>Study Information</Card.Header>
                <Formik
                    initialValues={{
                        id,
                        title,
                        description
                    }}
                    onSubmit={updateStudy}>
                    {({ values, handleChange, handleBlur, handleSubmit }) => (
                        <Form onSubmit={handleSubmit} className="m-4">
                            <Form.Label>Study Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                placeholder="Enter a title"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.title}
                            />
                            <Form.Label className="mt-3">Study Description</Form.Label>
                            <Form.Control
                                type="text"
                                name="description"
                                placeholder="Enter a description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                            />
                            <Button ref={buttonRef} type="submit" className="mt-3 float-right">
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

const QuestionnairesSection = ({ studyID }) => {
    const router = useRouter();
    const [createQuestionnaireMutation] = useMutation(CREATE_QUESTIONNAIRE);
    const getStudyQuestionnaires = useQuery(GET_STUDY_QUESTIONNAIRES, {
        variables: { studyID }
    });

    const createQuestionnaire = async () => {
        const questionnaire = {
            title: 'New Questionnaire',
            description: 'This is a new questionnaire',
            studyID
        };
        const { data } = await createQuestionnaireMutation({
            variables: { questionnaire }
        });
        getStudyQuestionnaires.refetch();
        router.push(`/studies/${studyID}/questionnaire/${data.createQuestionnaire.id}`);
    };

    return (
        <>
            <h5 className="mx-3 mt-5 mb-3">Questionnaires</h5>
            <Questionnaires
                getStudyQuestionnaires={getStudyQuestionnaires}
                refetch={getStudyQuestionnaires.refetch}
                studyID={studyID}
            />
            <Button className="float-right mt-3 mb-5" onClick={createQuestionnaire}>
                Create Questionnaire
            </Button>
        </>
    );
};

const Questionnaires = ({ getStudyQuestionnaires, refetch, studyID }) => {
    const { loading, error, data } = getStudyQuestionnaires;

    if (loading) return <p>Loading...</p>;
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

    return (
        <ListGroup>
            {data.getStudyQuestionnaires.map((q, i) => (
                <Questionnaire q={q} refetch={refetch} studyID={studyID} key={i} />
            ))}
        </ListGroup>
    );
};

const Questionnaire = ({ q, refetch, studyID }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [removeQuestionnaire] = useMutation(REMOVE_QUESTIONNAIRE);
    const getCsvOfResponsesQuery = useQuery(GET_CSV_OF_RESPONSES, {
        variables: { questionnaireID: q.id }
    });
    const router = useRouter();
    const buttonRef = useRef(null);

    const MAIN_PATH = `/studies/${studyID}/questionnaire/${q.id}`;
    const VIEW_PATH = `${MAIN_PATH}/answer`;
    const RESPONSES_PATH = `${MAIN_PATH}/responses`;

    const copyToClipboard = (VIEW_PATH) => {
        copy(`${window.location.hostname}:${window.location.port}${VIEW_PATH}`);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
    };

    const deleteQuestionnaire = async (questionnaire) => {
        await removeQuestionnaire({ variables: { questionnaireID: questionnaire.id } });
        refetch();
    };

    const { loading, error, data } = getCsvOfResponsesQuery;
    if (loading) return <p>Loading...</p>;
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
    // if (data) return <pre>{JSON.stringify(data, null, 2)}</pre>;

    // const downloadCSV = async () => {
    //     const { loading, error, data } = getCsvOfResponsesQuery;
    //     if (loading) return <p>Loading...</p>;
    //     if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
    //     if (data) return;
    // };

    if (data)
        return (
            <ListGroup.Item>
                <div className={styles.questionnaireItem}>
                    <Col>
                        <p className="m-0">{q.title}</p>
                    </Col>
                    <Col>
                        <p className="m-0">{q.description}</p>
                    </Col>
                    <div>
                        <Button
                            variant="success"
                            ref={buttonRef}
                            size="sm"
                            onClick={() => copyToClipboard(VIEW_PATH)}>
                            Copy
                        </Button>
                        <Overlay target={buttonRef.current} show={showTooltip} placement="bottom">
                            {(props) => <Tooltip {...props}>Link copied!</Tooltip>}
                        </Overlay>

                        <Button
                            className="ml-4"
                            variant="primary"
                            size="sm"
                            onClick={() => router.push(VIEW_PATH)}>
                            View
                        </Button>

                        <Button
                            className="ml-4"
                            variant="secondary"
                            size="sm"
                            onClick={() => router.push(`${MAIN_PATH}/edit`)}>
                            Edit
                        </Button>

                        <a
                            href={getCsvOfResponsesQuery.data.getCSVOfResponses}
                            target="_blank"
                            rel="noopener noreferrer"
                            download>
                            <Button className="ml-4" variant="info" size="sm">
                                Export
                            </Button>
                        </a>

                        <Button
                            className="ml-4"
                            variant="danger"
                            size="sm"
                            onClick={() => deleteQuestionnaire(q)}>
                            Delete
                        </Button>
                    </div>
                    <Button
                        className="ml-4"
                        variant="info"
                        onClick={() => router.push(RESPONSES_PATH)}>
                        View Responses
                    </Button>
                </div>
            </ListGroup.Item>
        );
};

export default StudyPage;
