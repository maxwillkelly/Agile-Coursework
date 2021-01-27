import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Button, Container, ListGroup, Row, Col } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import { GET_QUESTIONNAIRES } from '../queries/questionnaires';

const QuestionnairesPage = () => {
    const router = useRouter();
    const getQuestionnaires = useQuery(GET_QUESTIONNAIRES);

    return (
        <>
            <Head>
                <title>Questionnaires</title>
            </Head>
            <Navigation />
            <main>
                <Container className="mt-3">
                    <Questionnaires getQuestionnaires={getQuestionnaires} />
                    <Button
                        className="float-right mt-3"
                        onClick={() => router.push('/studies/questionnaire/creator')}>
                        Create Questionnaire
                    </Button>
                </Container>
            </main>
        </>
    );
};

const Questionnaires = ({ getQuestionnaires }) => {
    const { loading, error, data } = getQuestionnaires;

    if (loading) return <p>Loading...</p>;
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

    return (
        <ListGroup>
            {data.getQuestionnaires.map((q, i) => {
                return (
                    <ListGroup.Item key={i}>
                        <Row>
                            <Col>
                                <p>{q.title}</p>
                            </Col>
                            <Col>
                                <p>{q.description}</p>
                            </Col>
                        </Row>
                    </ListGroup.Item>
                );
            })}
        </ListGroup>
    );
};

export default QuestionnairesPage;
