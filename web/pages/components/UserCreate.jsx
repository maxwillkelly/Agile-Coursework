import { useState } from 'react';
import { Form } from 'react-bootstrap';
export const UserForm = () => {
    const [userDetails, setUserDetails] = useState({});
    return (
        <Form>
            <Form.Group>
                <Form.Label>First name</Form.Label>
                <Form.Control
                    placeholder="Enter first name..."
                    value={userDetails.firstname}
                    onChange={(e) => setUserDetails({ firstname: e.target.value })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Last name</Form.Label>
                <Form.Control
                    placeholder="Enter last name..."
                    value={userDetails.lastname}
                    onChange={(e) => setUserDetails({ lastname: e.target.value })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                    placeholder="Enter email address..."
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ email: e.target.value })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    placeholder="Enter password..."
                    value={userDetails.password}
                    onChange={(e) => setUserDetails({ password: e.target.value })}
                />
            </Form.Group>
            <Form.Group>
                <Form.Label>Role</Form.Label>
                <Form.Control
                    as="select"
                    value={userDetails.role}
                    onChange={(e) => setUserDetails({ role: e.target.value })}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </Form.Control>
            </Form.Group>
        </Form>
    );
};
