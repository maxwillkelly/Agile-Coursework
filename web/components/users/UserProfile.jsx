import styles from '../../styles/admin.module.scss';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import UPDATE_USER from '../../mutations/updateUser';
import DELETE_USER from '../../mutations/deleteUser';
import { useMutation } from '@apollo/client';
export const UserProfile = ({ selectedUser: user, setSuccessVal, setAlertVisibility }) => {
    const [details, setDetails] = useState({ ...user });
    const [updateUser] = useMutation(UPDATE_USER);
    const [deleteUser] = useMutation(DELETE_USER);

    const handleUpdateUser = () => {
        if (!details.id) {
            return;
        }
        updateUser({
            variables: { ...details }
        })
            .then(() => {
                setSuccessVal([true, 'Successfully updated user']);
                setAlertVisibility(true);
                // console.log(dataUpdate);
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
    return (
        <div className={styles.containerItem}>
            <h2>Selected User</h2>
            <Form>
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
                        onChange={(e) => setDetails((prev) => ({ ...prev, email: e.target.value }))}
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
                <Form.Group>
                    <Form.Label>ID</Form.Label>
                    <Form.Control
                        value={details.id || ''}
                        type="text"
                        readOnly={true}
                        onChange={(e) => setDetails((prev) => ({ ...prev, id: e.target.value }))}
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
        </div>
    );
};

export default UserProfile;
