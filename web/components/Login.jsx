import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Alert, Card, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import Cookies from 'js-cookie';
import { UserContext } from '../contexts';
import loginAsync from '../pages/api/login';

const Login = () => {
    const { userToken, setUserToken } = useContext(UserContext);
    const [errors, setErrors] = useState([]);
    // const router = useRouter();

    const handleLogin = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        try {
            // eslint-disable-next-line no-unused-vars
            const res = await loginAsync(values);
            if (res.success) {
                resetForm();
                setUserToken(res);
                Cookies.set('userToken', res, { expires: new Date(res.expire) });
                // if (typeof window !== 'undefined') router.push(routes.shift);
                console.log('Success');
            }
            setErrors(res);
        } catch (err) {
            setErrors('Sorry: Your login credentials are not correct');
        }
        setSubmitting(false);
    };

    return (
        <Card className="m-5 p-3">
            <Formik initialValues={{ email: '', password: '' }} onSubmit={handleLogin}>
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
                        <LoginFooter errors={errors} />
                        {userToken && <pre>{JSON.stringify(userToken, null, 2)}</pre>}
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

const LoginFooter = ({ errors }) => {
    if (errors.length > 0)
        return (
            <Alert className="mt-3" variant="danger">
                {errors}
            </Alert>
        );
    return null;
};

export default Login;
