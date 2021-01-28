import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { Container, ListGroup, Row, Col } from 'react-bootstrap';
import { GET_STUDY } from '../../queries/study';
import Navigation from '../../components/Navigation';

const StudyPage = () => {
    return (
        <>
            <Head>
                <title>Study</title>
            </Head>
            <Navigation />
            <main>
                <Container className="mt-3">
                    <Row>
                        <Col>
                            <StudyInfo />
                        </Col>
                        <Col>
                            <StaffList />
                        </Col>
                    </Row>
                </Container>
            </main>
        </>
    );
};

const StaffList = (staff) => {
    return (
        <ListGroup>
            {staff.map((staffMember, index) => (
                <StaffMember staffMember={staffMember} key={index} />
            ))}
        </ListGroup>
    );
};

const StaffMember = ({ staffMember }) => {
    return (
        <ListGroup.Item>
            <div className="d-flex">
                <Col>
                    <p className="m-0">
                        {staffMember.firstName} {staffMember.lastName}
                    </p>
                </Col>
                <Col>
                    <p className="m-0">{staffMember.level}</p>
                </Col>
                <Col>
                    <p className="m-0">{staffMember.permission}</p>
                </Col>
                <Col>
                    <p className="m-0">{staffMember.email}</p>
                </Col>
            </div>
        </ListGroup.Item>
    );
};

const StudyInfo = () => {
    const router = useRouter();
    const { loading, error, data } = useQuery(GET_STUDY, {
        variables: { id: router.query.id }
    });

    if (loading) return null;
    if (error) return null;
    if (data) {
        return <h2 className="mx-3">{router.params.id}</h2>;
    }
};

export default StudyPage;
