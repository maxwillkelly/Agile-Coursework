import { useContext, useState } from 'react';
// import { useRouter } from 'next/router';
import { Card, Form, Button } from 'react-bootstrap';
import { Formik, useField } from 'formik';
import * as yup from 'yup';
import { UserContext } from '../contexts';
import { login } from '../libs/user';
import loginAsync from '../pages/api/login';
import styles from './styles/login.module.scss';

const Login = () => {
    const { setUserToken } = useContext(UserContext);
    const [error, setError] = useState(false);
    // const router = useRouter();

    const validationSchema = yup.object({
        email: yup.string().required().max(128),
        password: yup.string().required().max(128)
    });

    const loginFunc = async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        try {
            const res = await loginAsync(values);
            resetForm();
            setUserToken(res);
            login(res);
            // if (typeof window !== 'undefined') router.push(routes.shift);
            setError(false);
        } catch (err) {
            setError(true);
        }

        setSubmitting(false);
    };

    return (
        <Card className={`${styles.loginCard} p-4`}>
            <h3 className="text-center">Login</h3>
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={loginFunc}>
                {({ handleSubmit, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                        <TextField
                            label="Email address"
                            name="email"
                            type="email"
                            placeholder="Enter email"
                            loginError={error}
                        />
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            loginError={error}
                            last={true}
                        />
                        <Button
                            className="float-right"
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}>
                            Login
                        </Button>
                        {/* {userToken && <pre>{JSON.stringify(userToken, null, 2)}</pre>} */}
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

const TextField = ({ placeholder, type, loginError, last, ...props }) => {
    const [field, meta] = useField(props);
    // Checks for client validation error
    let errorText = capitaliseFirstLetter(meta.error && meta.touched ? meta.error : '');
    // Checks for server-side error
    if (errorText === '' && loginError && last)
        errorText = 'Sorry, your username or password is incorrect';

    return (
        <Form.Group>
            <Form.Label>{props.label}</Form.Label>
            <Form.Control
                placeholder={placeholder}
                type={type}
                {...field}
                isInvalid={!!errorText || loginError}
            />
            <Form.Control.Feedback type="invalid">{errorText}</Form.Control.Feedback>
        </Form.Group>
    );
};

// Credits to https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
const capitaliseFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export default Login;
