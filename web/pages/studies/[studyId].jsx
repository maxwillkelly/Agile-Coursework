import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { GET_STUDY } from '../../queries/study';
import Navigation from '../../components/Navigation';
import MainBreadcrumb from '../../components/MainBreadcrumb';
import VideoNotes from '../../components/study/VideoNotes';
import StaffList from '../../components/study/StaffList';
import PermissionsCard from '../../components/study/Permissions';
import AddStaffCard from '../../components/study/AddStaff';
import StudyInfo from '../../components/study/StudyInfo';
import QuestionnairesSection from '../../components/study/Questionnaires';
import styles from '../../styles/studies.module.scss';

const StudyPage = () => {
    const router = useRouter();
    const studyID = router.query.studyId;
    const { loading, error, data, refetch } = useQuery(GET_STUDY, {
        variables: { id: studyID }
    });

    if (loading)
        return (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        );
    if (error) return null;
    if (data)
        return (
            <>
                <Head>
                    <title>Study</title>
                </Head>
                <Navigation />
                <MainBreadcrumb />
                <main>
                    <Container className={styles.studyContainer}>
                        <Row className={styles.studyRow}>
                            <Col>
                                <StudyInfo data={data.getStudy} />
                                <AddStaffCard study={data.getStudy} refetch={refetch} />
                            </Col>
                            <Col>
                                <PermissionsCard study={data.getStudy} />
                            </Col>
                        </Row>
                        <StaffList
                            staff={data.getStudy.staff}
                            studyID={studyID}
                            refetch={refetch}
                        />
                        <QuestionnairesSection studyID={studyID} />
                        <VideoNotes studyID={studyID} />
                    </Container>
                </main>
            </>
        );
};

export default StudyPage;
