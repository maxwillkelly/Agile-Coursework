import { useQuery } from '@apollo/client';
import { USERS_QUERY } from '../../queries/users';
import { UserListSingle } from './UserListSingle';
import { UserForm } from './UserCreate';
import styles from '../../../styles/users.module.scss';
import Head from 'next/head';
import Navigation from '../Navigation';

const UserList = ({ users }) => {
    // console.log(users);
    return users.map((user) => <UserListSingle key={user.id} user={user} />);
};

const UserDashboard = () => {
    const { loading, error, data } = useQuery(USERS_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

    return (
        <>
            <Head>
                <title>UserDashboard</title>
            </Head>
            <Navigation />
            <div className={styles.userDashboard}>
                <div className="user-list">
                    <h3 className={styles.sectionHeader}>Users</h3>
                    <UserList users={data.getUsers} />
                </div>
                <div className="user-create">
                    <h3 className={styles.sectionHeader}>New User</h3>
                    <UserForm />
                </div>
            </div>
        </>
    );
};

export default UserDashboard;
