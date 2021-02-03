import { useQuery, useMutation } from '@apollo/client';
import { Button, Card, Spinner, Form } from 'react-bootstrap';
import { USERS_QUERY } from '../../queries/users';
import { ADD_STAFF_TO_STUDY } from '../../mutations/study';
import styles from '../../styles/studies.module.scss';
import { Formik } from 'formik';

const AddStaffCard = ({ study }) => {
    const { loading, error, data, refetch } = useQuery(USERS_QUERY);
    const [addStaff] = useMutation(ADD_STAFF_TO_STUDY);

    const addStaffMemberToStudy = async (variables) => {
        if (!variables.staffID) return;
        // console.log(variables);
        await addStaff({ variables });
        refetch();
    };

    if (loading)
        return (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        );
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

    return (
        <Card className={styles.studyCard}>
            <Card.Header>Add a staff member</Card.Header>

            <Formik
                initialValues={{
                    studyID: study.id,
                    staffID: ''
                }}
                onSubmit={addStaffMemberToStudy}>
                {({ values, handleChange, handleBlur, handleSubmit }) => (
                    <Form className="m-4" onSubmit={handleSubmit}>
                        <Form.Label>Choose a staff member</Form.Label>
                        <Form.Control
                            as="select"
                            name="staffID"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.staffID}>
                            <option value="">Choose...</option>
                            {data &&
                                data.getUsers
                                    .filter((user) => {
                                        for (const staffMember of study.staff) {
                                            if (staffMember.id === user.id) return false;
                                        }
                                        return true;
                                    })
                                    .map((user) => (
                                        <option
                                            key={user.id}
                                            value={
                                                user.id
                                            }>{`${user.firstName} ${user.lastName}`}</option>
                                    ))}
                        </Form.Control>
                        <Button
                            type="submit"
                            className={styles.submitButton}
                            variant="success"
                            disabled={!values.staffID}>
                            Add
                        </Button>
                    </Form>
                )}
            </Formik>
        </Card>
    );
};

export default AddStaffCard;
