import { Card, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import loginFunc from '../pages/api/login';

const Login = () => {
    return (
        <Card className="m-5 p-3">
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    setSubmitting(true);
                    loginFunc(values);
                    resetForm();
                    setSubmitting(false);
                }}>
                {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <Form>
                        <Form.Group>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                name="email"
                                type="email"
                                placeholder="Enter email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                name="password"
                                type="password"
                                placeholder="Password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting}>
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default Login;
