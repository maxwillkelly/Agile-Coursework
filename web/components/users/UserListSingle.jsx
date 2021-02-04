import styles from '../styles/admin.module.scss';
export const UserListSingle = ({ user, setSelectedUser }) => {
    return (
        <li className={styles.listItem} onClick={() => setSelectedUser(user)} aria-hidden="true">
            <div className={styles.listContent}>
                <h4 className={styles.listItem__name}>
                    {user.firstName} {user.lastName}
                </h4>
                <h4 className={styles.listItem__role}>{user.permission}</h4>
            </div>
        </li>
    );
};

export default UserListSingle;
