import styles from '../../styles/users.module.scss';
export const UserListSingle = ({ user }) => {
    return (
        <div className={styles.card}>
            <h3 className={styles.name}>
                Name: {user.firstName} {user.lastName}
            </h3>
            <h3 className={styles.role}>Role: {user.permission}</h3>
        </div>
    );
};
