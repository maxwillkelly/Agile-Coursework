import { UserListSingle } from './UserListSingle';
import { UserForm } from './UserCreate';
import styles from '../../styles/users.module.scss';
const users = [
    { _id: 1, firstName: 'Ram', lastName: 'Say', permission: 2, email: 'example@example.com' },
    { _id: 2, firstName: 'Ram', lastName: 'Say', permission: 1, email: 'example@example.com' },
    { _id: 3, firstName: 'Ram', lastName: 'Say', permission: 2, email: 'example@example.com' },
    { _id: 4, firstName: 'Ram', lastName: 'Say', permission: 0, email: 'example@example.com' },
    { _id: 5, firstName: 'Ram', lastName: 'Say', permission: 0, email: 'example@example.com' }
];
const UserList = () => {
    return users.map((user) => <UserListSingle key={user.id} user={user} />);
};

export const UserDashboard = () => {
    return (
        <div className="m-4">
            <div className="user-list">
                <h3 className={styles.sectionHeader}>Users</h3>
                <UserList />
            </div>
            <div className="user-create">
                <h3 className={styles.sectionHeader}>New User</h3>
                <UserForm />
            </div>
        </div>
    );
};
