import styles from '../../styles/studies.module.scss';
import { ListGroup, Col, Button } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { REMOVE_STAFF_FROM_STUDY } from '../../mutations/study';

const StaffList = ({ staff, studyID, refetch }) => {
    return (
        <>
            <h5 className={styles.questionnairesTableHeader}>Staff</h5>
            <ListGroup>
                <ListGroup.Item>
                    <div className={styles.staffTableRow}>
                        <Col>
                            <p className={styles.staffTableColumn}>Name</p>
                        </Col>
                        <Col>
                            <p className={styles.staffTableColumn}>Permission</p>
                        </Col>
                        <Col>
                            <p className={styles.staffTableColumn}>Email</p>
                        </Col>
                        <Col>
                            <p className={`float-right ${styles.staffTableColumn}`}>Remove</p>
                        </Col>
                    </div>
                </ListGroup.Item>
                {staff.map((staffMember, index) => (
                    <StaffMember
                        staffMember={staffMember}
                        key={index}
                        studyID={studyID}
                        refetch={refetch}
                    />
                ))}
            </ListGroup>
        </>
    );
};

const StaffMember = ({ staffMember, studyID, refetch }) => {
    const [removeStaffFromStudy] = useMutation(REMOVE_STAFF_FROM_STUDY);

    const removeStaffMember = async () => {
        await removeStaffFromStudy({ variables: { staffID: staffMember.id, studyID } });
        refetch();
    };

    return (
        <ListGroup.Item>
            <div className={styles.staffTableRow}>
                <Col>
                    <p className={styles.staffTableColumn}>
                        {staffMember.firstName} {staffMember.lastName}
                    </p>
                </Col>
                <Col>
                    <p className={styles.staffTableColumn}>{staffMember.permission}</p>
                </Col>
                <Col>
                    <p className={styles.staffTableColumn}>{staffMember.email}</p>
                </Col>
                <Col>
                    <Button variant="danger" className="float-right" onClick={removeStaffMember}>
                        Remove
                    </Button>
                </Col>
            </div>
        </ListGroup.Item>
    );
};

export default StaffList;
