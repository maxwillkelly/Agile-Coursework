import { useQuery } from '@apollo/client';
import { USERS_QUERY } from '../queries/users';
import { UserListSingle } from './components/UserListSingle';
import { UserForm } from './components/UserCreate';
import styles from '../styles/users.module.scss';

// const users = [
//     { _id: 1, firstName: 'Ram', lastName: 'Say', permission: 2, email: 'example@example.com' },
//     { _id: 2, firstName: 'Ram', lastName: 'Say', permission: 1, email: 'example@example.com' },
//     { _id: 3, firstName: 'Ram', lastName: 'Say', permission: 2, email: 'example@example.com' },
//     { _id: 4, firstName: 'Ram', lastName: 'Say', permission: 0, email: 'example@example.com' },
//     { _id: 5, firstName: 'Ram', lastName: 'Say', permission: 0, email: 'example@example.com' }
// ];

const UserList = ({ users }) => {
    console.log(users);
    return users.map((user) => <UserListSingle key={user.id} user={user} />);
};

const UserDashboard = () => {
    const { loading, error, data } = useQuery(USERS_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

    return (
        <div className="m-4">
            <div className="user-list">
                <h3 className={styles.sectionHeader}>Users</h3>
                <UserList users={data.getUsers} />
            </div>
            <div className="user-create">
                <h3 className={styles.sectionHeader}>New User</h3>
                <UserForm />
            </div>
        </div>
    );
};

export default UserDashboard;
