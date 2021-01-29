import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import SET_NEW_USER from '../../mutations/setNewUser';

export const UserForm = ({ setSuccessVal, setAlertVisibility, handleClose }) => {
    const [userDetails, setUserDetails] = useState({});
    const [setNewUser, { loading, error, data }] = useMutation(SET_NEW_USER);

    const handleUserCreate = (e) => {
        e.preventDefault();

        setNewUser({ variables: { ...userDetails, level: parseInt(userDetails.level) || 0 } })
            .then(() => {
                setSuccessVal([true, 'Successfully created new user']);
                setAlertVisibility(true);
            })
            .catch(() => {
                setSuccessVal([false, 'Failed to create new user']);
                setAlertVisibility(true);
            });
    };

    return (
        <Form onSubmit={handleUserCreate}>
            <Form.Group>
                <Form.Label>First name</Form.Label>
                <Form.Control
                    placeholder="Enter first name..."
                    value={userDetails.firstName}
                    onChange={(e) =>
                        setUserDetails((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                    placeholder="Enter last name..."
                    value={userDetails.lastName}
                    onChange={(e) =>
                        setUserDetails((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    placeholder="Enter email address..."
                    value={userDetails.email}
                    type="email"
                    onChange={(e) => setUserDetails((prev) => ({ ...prev, email: e.target.value }))}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    placeholder="Enter password..."
                    value={userDetails.password}
                    type="password"
                    onChange={(e) =>
                        setUserDetails((prev) => ({ ...prev, password: e.target.value }))
                    }
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control
                    as="select"
                    value={userDetails.level || 0}
                    onChange={(e) =>
                        setUserDetails((prev) => ({ ...prev, level: e.target.value }))
                    }>
                    <option value={0} selected>
                        Co-Researcher
                    </option>
                    <option value={1}>Researcher</option>
                    <option value={2}>Lab Manager</option>
                </Form.Control>
            </Form.Group>
            <Button type="submit" variant="success" onClick={handleClose}>
                Create
            </Button>
        </Form>
    );
};

export const CreateModal = ({ setSuccessVal, setAlertVisibility }) => {
    const [visible, setVisible] = useState(false);
    const handleClose = () => setVisible(false);
    const handleShow = () => setVisible(true);

    return (
        <div>
            <Button onClick={handleShow}>Create User</Button>
            <Modal show={visible} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Create A New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UserForm
                        setSuccessVal={setSuccessVal}
                        setAlertVisibility={setAlertVisibility}
                        handleClose={handleClose}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CreateModal;
