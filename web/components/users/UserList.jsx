import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { FormControl } from 'react-bootstrap';
import { USERS_QUERY } from '../../queries/users';
import UserListSingle from './UserListSingle';
import styles from '../../styles/admin.module.scss';
export const UserList = ({ setSelectedUser }) => {
    const { loading, error, data } = useQuery(USERS_QUERY);
    const [searchVal, setSearchVal] = useState('');

    const searchFilter = (user) => {
        const fullName = `${user.firstName.toLowerCase()} ${user.lastName.toLowerCase()}`;

        return fullName.includes(searchVal.toLowerCase());
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

    return (
        <div className={styles.containerItem}>
            <h2>Search Users</h2>
            <FormControl
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Enter text here..."
                className={styles.search}
            />
            <ul className={styles.list}>
                {data &&
                    data.getUsers
                        .filter((user) => searchFilter(user))
                        .map((user) => (
                            <UserListSingle
                                setSelectedUser={setSelectedUser}
                                user={user}
                                key={user.id}
                            />
                        ))}
            </ul>
        </div>
    );
};

export default UserList;
