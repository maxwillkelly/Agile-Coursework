import Head from 'next/head';
import UserList from '../components/users/UserList';
import UserCreate from '../components/users/UserCreate';
import UserProfile from '../components/users/UserProfile';
import { useState } from 'react';
import { Alert } from 'react-bootstrap';
import styles from '../styles/admin.module.scss';
import Navigation from '../components/Navigation';

export const AdminDashboard = () => {
    const [successVal, setSuccessVal] = useState([null]);
    const [alertVisibility, setAlertVisibility] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    return (
        <>
            <Head>
                <title>Admin Dashboard</title>
            </Head>
            <Navigation />

            <main className={styles.container}>
                <h1>Admin Dashboard</h1>
                <UserCreate setSuccessVal={setSuccessVal} setAlertVisibility={setAlertVisibility} />
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
                <div className={styles.gridContainer}>
                    <UserList setSelectedUser={setSelectedUser} />
                    <UserProfile
                        selectedUser={selectedUser}
                        setSuccessVal={setSuccessVal}
                        setAlertVisibility={setAlertVisibility}
                    />
                </div>
            </main>
        </>
    );
};

export default AdminDashboard;
