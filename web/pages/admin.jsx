import Head from 'next/head';
import { useState } from 'react';
import UserList from '../components/users/UserList';
import UserCreate from '../components/users/UserCreate';
import UserProfile from '../components/users/UserProfile';
import { Alert, Container, Row, Col, Spinner } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import { USERS_QUERY } from '../queries/users';
import { useQuery } from '@apollo/client';

export const AdminDashboard = () => {
    const { loading, error, data, refetch } = useQuery(USERS_QUERY);
    const [successVal, setSuccessVal] = useState([null]);
    const [alertVisibility, setAlertVisibility] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    if (loading)
        return (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        );

    if (error) return <p>An error occurred...</p>;

    return (
        <>
            <Head>
                <title>Admin Dashboard</title>
            </Head>
            <Navigation />

            <Container>
                <Row>
                    <Col>
                        <h1>Admin Dashboard</h1>
                    </Col>
                </Row>
                <Row className="mt-1 mb-3">
                    <Col>
                        <UserCreate
                            refetch={refetch}
                            setSuccessVal={setSuccessVal}
                            setAlertVisibility={setAlertVisibility}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Alert
                            variant={
                                successVal.length > 0 && successVal[0] == true
                                    ? 'success'
                                    : successVal[0] === false
                                    ? 'danger'
                                    : ''
                            }
                            dismissible
                            show={alertVisibility}
                            className="mt-3"
                            onClose={() => setAlertVisibility(false)}>
                            {successVal[1]}
                        </Alert>
                    </Col>
                </Row>
                <Row lg="2" md="1" sm="1" xs="1">
                    <Col>
                        <UserList setSelectedUser={setSelectedUser} users={data.getUsers} />
                    </Col>
                    <Col>
                        {selectedUser && (
                            <UserProfile
                                setSelectedUser={setSelectedUser}
                                refetch={refetch}
                                selectedUser={selectedUser}
                                setSuccessVal={setSuccessVal}
                                setAlertVisibility={setAlertVisibility}
                            />
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default AdminDashboard;
