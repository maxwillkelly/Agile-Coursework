import styles from '../../styles/admin.module.scss';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { Button, Card, Spinner } from 'react-bootstrap';
import UPDATE_USER from '../../mutations/updateUser';
import DELETE_USER from '../../mutations/deleteUser';
import { useMutation } from '@apollo/client';
export const UserProfile = ({
    selectedUser: user,
    setSelectedUser,
    setSuccessVal,
    setAlertVisibility,
    refetch
}) => {
    const [details, setDetails] = useState({ ...user });
    const [updateUser] = useMutation(UPDATE_USER);
    const [deleteUser] = useMutation(DELETE_USER);

    // function to handle updating user request
    const handleUpdateUser = () => {
        if (!details.id) {
            return;
        }

        updateUser({
            variables: { ...details, level: parseInt(details.level) }
        })
            .then(() => {
                setSuccessVal([true, 'Successfully updated user']);
                setAlertVisibility(true);
                refetch();
            })
            .catch(() => {
                setSuccessVal([false, 'Failed to update user']);
                setAlertVisibility(true);
            });
    };
    const handleDeleteUser = () => {
        deleteUser({
            variables: { id: user.id }
        })
            .then(() => {
                setSuccessVal([true, 'Successfully deleted user']);
                setAlertVisibility(true);
                refetch();
                setSelectedUser(null);
            })
            .catch(() => {
                setSuccessVal([false, 'Failed to delete user']);
                setAlertVisibility(true);
            });
    };

    useEffect(() => {
        setDetails(user);
    }, [user]);

    if (!details) {
        return null;
    }
    if (!user)
        return (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        );

    return (
        <Card>
            <Card.Header>Selected User</Card.Header>
            <Card.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>ID</Form.Label>
                        <Form.Control
                            value={details.id || ''}
                            type="text"
                            readOnly={true}
                            onChange={(e) =>
                                setDetails((prev) => ({ ...prev, id: e.target.value }))
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            value={details.firstName}
                            onChange={(e) =>
                                setDetails((prev) => ({ ...prev, firstName: e.target.value }))
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            value={details.lastName}
                            onChange={(e) =>
                                setDetails((prev) => ({ ...prev, lastName: e.target.value }))
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            value={details.email}
                            onChange={(e) =>
                                setDetails((prev) => ({ ...prev, email: e.target.value }))
                            }
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            as="select"
                            value={details.level}
                            onChange={(e) =>
                                setDetails((prev) => ({ ...prev, level: e.target.value }))
                            }>
                            <option value={0}>Co-Researcher</option>
                            <option value={1}>Researcher</option>
                            <option value={2}>Admin</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            value={details.password || ''}
                            type="password"
                            onChange={(e) =>
                                setDetails((prev) => ({ ...prev, password: e.target.value }))
                            }
                        />
                    </Form.Group>

                    <Form.Group className={styles.profileButtons}>
                        <Button onClick={handleUpdateUser} variant="success">
                            Update
                        </Button>
                        <Button onClick={handleDeleteUser} variant="danger">
                            Delete
                        </Button>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default UserProfile;
