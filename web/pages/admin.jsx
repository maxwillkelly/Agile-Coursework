import Head from 'next/head';
import UserList from '../components/users/UserList';
import UserCreate from '../components/users/UserCreate';
import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import styles from '../styles/admin.module.scss';

export const AdminDashboard = () => {
    const [successVal, setSuccessVal] = useState(null);
    const [alertVisibility, setAlertVisibility] = useState(false);
    return (
        <>
            <Head>
                <title>Admin Dashboard</title>
            </Head>

            <main className={styles.container}>
                <h1>Admin Dashboard</h1>
                <UserCreate setSuccessVal={setSuccessVal} setAlertVisibility={setAlertVisibility} />
                <Alert
                    variant={successVal == true ? 'success' : successVal === false ? 'danger' : ''}
                    dismissible
                    show={alertVisibility}
                    onClose={() => setAlertVisibility(false)}>
                    {successVal ? (
                        <p>Successfully created new user!</p>
                    ) : (
                        <p>Unable to create new user... </p>
                    )}
                </Alert>
                <div className={styles.gridContainer}>
                    <UserList />
                </div>
            </main>
        </>
    );
};

export default AdminDashboard;
