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
import { EDIT_STUDY, ADD_STAFF_TO_STUDY, REMOVE_STAFF_FROM_STUDY } from '../../mutations/study';
import { USERS_QUERY } from '../../queries/users';
import Navigation from '../../components/Navigation';
import { Formik } from 'formik';
// import { ValuesOfCorrectTypeRule } from 'graphql';

const StudyPage = () => {
    const router = useRouter();
    const { loading, error, data, refetch } = useQuery(GET_STUDY, {
        variables: { id: router.query.id }
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
                            studyID={data.getStudy.id}
                            refetch={refetch}
                        />
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
        console.log(variables);
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
                            <option selected value="">
                                Choose...
                            </option>
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
            .then((res) => {
                console.log('akjsdalksdjlaskdjasd' + res);
            })
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

export default StudyPage;
