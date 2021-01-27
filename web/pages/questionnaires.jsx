import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Container, ListGroup } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import { GET_QUESTIONNAIRES } from '../queries/questionnaire';
import { CREATE_QUESTIONNAIRE } from '../mutations/questionnaire';
import styles from '../styles/questionnaires.module.scss';

const QuestionnairesPage = () => {
    // const router = useRouter();
    const [createQuestionnaireMutation] = useMutation(CREATE_QUESTIONNAIRE);
    const getQuestionnaires = useQuery(GET_QUESTIONNAIRES);

    const createQuestionnaire = () => {
        const questionnaire = { title: '', description: '', studyID: '' };
        createQuestionnaireMutation({
            variables: { questionnaire }
        }).then((data) => console.log(data));
        // data.then(() => router.push(`/studies/questionnaire/${data.createQuestionaire.id}`));
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
                    <Questionnaires getQuestionnaires={getQuestionnaires} />
                    <Button className="float-right mt-3" onClick={createQuestionnaire}>
                        Create Questionnaire
                    </Button>
                </Container>
            </main>
        </>
    );
};

const Questionnaires = ({ getQuestionnaires }) => {
    const { loading, error, data } = getQuestionnaires;

    const router = useRouter();

    if (loading) return <p>Loading...</p>;
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

    return (
        <ListGroup>
            {data.getQuestionnaires.map((q, i) => {
                return (
                    <ListGroup.Item className="mt-3" key={i}>
                        <div className={styles.questionnaireItem}>
                            <p className="m-0">{q.title}</p>
                            <p className="m-0">{q.description}</p>
                            <div>
                                <Button
                                    variant="primary"
                                    onClick={() => router.push(`/studies/questionnaire/${q.id}`)}>
                                    View
                                </Button>

                                <Button
                                    className="ml-4"
                                    variant="secondary"
                                    onClick={() => router.push(`/studies/questionnaire/${q.id}`)}>
                                    Edit
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
