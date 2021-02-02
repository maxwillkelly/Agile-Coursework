import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Container, ListGroup, Spinner, Col } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import MainBreadcrumb from '../components/MainBreadcrumb';
import { getUserToken } from '../libs/user';
import { GET_STAFF_STUDIES } from '../queries/study';
import { CREATE_NEW_STUDY, DELETE_STUDY } from '../mutations/study';
import styles from '../styles/studies.module.scss';

const StudiesPage = () => {
    const [createNewStudy] = useMutation(CREATE_NEW_STUDY);
    const router = useRouter();

    const createStudy = async () => {
        const study = {
            title: 'New Study',
            description: 'This is new study',
            permissions: {
                edit: 1,
                create: 1,
                delete: 1
            },
            staff: []
        };
        await createNewStudy({ variables: { study } });
        router.push(`/studies/${study.id}`);
    };

    return (
        <>
            <Head>
                <title>Studies</title>
            </Head>
            <Navigation />
            <MainBreadcrumb />
            <main>
                <Container className={styles.studyContainer}>
                    <h2 className={styles.pageTitle}>Studies</h2>
                    <Studies />
                    <Button className={styles.createStudyButton} onClick={createStudy}>
                        Create Study
                    </Button>
                </Container>
            </main>
        </>
    );
};

const Studies = () => {
    const { loading, error, data } = useQuery(GET_STAFF_STUDIES, {
        variables: { staffID: getUserToken().id }
    });

    if (loading)
        return (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        );

    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

    if (data)
        return (
            <ListGroup>
                {data.getStaffStudies.map((study, index) => (
                    <Study study={study} key={index} />
                ))}
            </ListGroup>
        );
};

const Study = ({ study }) => {
    const router = useRouter();
    const [deleteStudy] = useMutation(DELETE_STUDY);

    const delete_Study = () => {
        deleteStudy({ variables: { studyID: study.id } });
    };

    return (
        <ListGroup.Item>
            <div className={styles.study}>
                <Col>
                    <p className={styles.studyInfo}>{study.title}</p>
                </Col>
                <Col>
                    <p className={styles.studyInfo}>{study.description}</p>
                </Col>
                <div>
                    <Button
                        className={styles.studyButton}
                        variant="primary"
                        onClick={() => router.push(`/studies/${study.id}`)}>
                        Edit
                    </Button>

                    <Button
                        className={styles.studyButton}
                        variant="danger"
                        onClick={() => delete_Study()}>
                        Delete
                    </Button>
                </div>
            </div>
        </ListGroup.Item>
    );
};

export default StudiesPage;
