import Head from 'next/head';
import { useRouter } from 'next/router';
// import { useQuery, useMutation } from '@apollo/client';
import { Button, Container, ListGroup } from 'react-bootstrap';
import Navigation from '../components/Navigation';

const questionnaires = [
    {
        name: 'What is life?'
    },
    {
        name: 'What is down?'
    },
    {
        name: 'What is up?'
    }
];

const QuestionnairesPage = () => {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Questionnaires</title>
            </Head>
            <Navigation />
            <main>
                <Container className="mt-3">
                    <Questionnaires />
                    <Button
                        className="float-right"
                        onClick={() => router.push('/studies/questionnaire/creator')}>
                        Create Questionnaire
                    </Button>
                </Container>
            </main>
        </>
    );
};

const Questionnaires = () => {
    return (
        <ListGroup>
            {questionnaires.map((q) => {
                <ListGroup.Item>{q.name}</ListGroup.Item>;
            })}
        </ListGroup>
    );
};

export default QuestionnairesPage;
