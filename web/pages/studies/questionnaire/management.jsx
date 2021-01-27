import { Head } from 'next/head';
// import { useQuery, useMutation } from '@apollo/client';
import { ListGroup } from 'react-bootstrap';

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

const QuestionnaireManagementPage = () => (
    <>
        <Head>
            <title>Questionnaire Management</title>
        </Head>
        <QuestionnaireManagement />
    </>
)

const QuestionnaireManagement = () => {
    return (
        <ListGroup>
            {questionnaires.map((q) => {
                <ListGroup.Item>{q.name}</ListGroup.Item>;
            })}
        </ListGroup>
    );
};

export default QuestionnaireManagementPage;
