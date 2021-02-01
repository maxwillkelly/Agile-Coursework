import { useState } from 'react';
import { FormControl, Card } from 'react-bootstrap';
import UserListSingle from './UserListSingle';
import styles from '../../styles/admin.module.scss';
export const UserList = ({ setSelectedUser, users }) => {
    const [searchVal, setSearchVal] = useState('');

    // filter function for searching users
    const searchFilter = (user) => {
        const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;

        return (
            fullName.includes(searchVal.toLowerCase()) ||
            user.permission.toLowerCase().includes(searchVal.toLowerCase())
        );
    };

    return (
        <Card>
            <Card.Header>Search Users</Card.Header>
            <FormControl
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Enter filter text here..."
                className={styles.search}
            />
            <Card.Body>
                <ul className={styles.list}>
                    {users &&
                        users
                            .filter((user) => searchFilter(user))
                            .map((user) => (
                                <UserListSingle
                                    setSelectedUser={setSelectedUser}
                                    user={user}
                                    key={user.id}
                                />
                            ))}
                </ul>
            </Card.Body>
        </Card>
    );
};

export default UserList;
