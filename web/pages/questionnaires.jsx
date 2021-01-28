import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Container, Col, ListGroup } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import { GET_QUESTIONNAIRES } from '../queries/questionnaire';
import { CREATE_QUESTIONNAIRE, REMOVE_QUESTIONNAIRE } from '../mutations/questionnaire';
import styles from '../styles/questionnaires.module.scss';

const QuestionnairesPage = () => {
    const router = useRouter();
    const [createQuestionnaireMutation] = useMutation(CREATE_QUESTIONNAIRE);
    const getQuestionnaires = useQuery(GET_QUESTIONNAIRES);

    const createQuestionnaire = async () => {
        const questionnaire = {
            title: 'New Questionnaire',
            description: 'This is a new questionnaire',
            studyID: '60103d9bec827463c8a40e34'
        };
        const { data } = await createQuestionnaireMutation({
            variables: { questionnaire }
        });
        getQuestionnaires.refetch();
        router.push(`/studies/questionnaire/${data.createQuestionaire.id}`);
    };

    return (
        <>
            <Head>
                <title>Questionnaires</title>W
            </Head>
            <Navigation />
            <main>
                <Container className="mt-3">
                    <h2 className="mx-3">All Questionnaires</h2>
                    <Questionnaires
                        getQuestionnaires={getQuestionnaires}
                        refetch={getQuestionnaires.refetch}
                    />
                    <Button className="float-right mt-3" onClick={createQuestionnaire}>
                        Create Questionnaire
                    </Button>
                </Container>
            </main>
        </>
    );
};

const Questionnaires = ({ getQuestionnaires, refetch }) => {
    const { loading, error, data } = getQuestionnaires;
    const [removeQuestionnaire] = useMutation(REMOVE_QUESTIONNAIRE);

    const deleteQuestionnaire = async (questionnaire) => {
        await removeQuestionnaire({ variables: { questionnaireID: questionnaire.id } });
        refetch();
    };

    const router = useRouter();

    if (loading) return <p>Loading...</p>;
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

    return (
        <ListGroup>
            {data.getQuestionnaires.map((q, i) => {
                return (
                    <ListGroup.Item key={i}>
                        <div className={styles.questionnaireItem}>
                            <Col>
                                <p className="m-0">{q.title}</p>
                            </Col>
                            <Col>
                                <p className="m-0">{q.description}</p>
                            </Col>
                            <div>
                                <Button
                                    variant="primary"
                                    onClick={() => router.push(`/studies/questionnaire/answer/${q.id}`)}>
                                    View
                                </Button>

                                <Button
                                    className="ml-4"
                                    variant="secondary"
                                    onClick={() => router.push(`/studies/questionnaire/${q.id}`)}>
                                    Edit
                                </Button>

                                <Button
                                    className="ml-4"
                                    variant="danger"
                                    onClick={() => deleteQuestionnaire(q)}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </ListGroup.Item>
                );
            })}
        </ListGroup>
    );
};

export default QuestionnairesPage;
