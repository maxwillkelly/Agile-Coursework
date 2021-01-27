import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { Col, Container, Row } from 'react-bootstrap';
import TitleForm from '../../../components/questionnaire/TitleForm';
import AddQuestionForm from '../../../components/questionnaire/AddQuestionForm';
import AddTextSection from '../../../components/questionnaire/AddTextSection';
import Question from '../../../components/questionnaire/Question';
import Navigation from '../../../components/Navigation';
import { GET_QUESTIONNAIRE } from '../../../queries/questionnaire';
// import styles from '../../../styles/questionnaire-creator.module.scss';

const QuestionnaireCreatorPage = () => {
    // const [questions, setQuestions] = useState(questionArray);
    const router = useRouter();
    const { loading, error, data } = useQuery(GET_QUESTIONNAIRE, {
        variables: { id: router.query.id }
    });

    return (
        <div>
            <Head>
                <title>Create a Questionnaire</title>
                <link rel="icon" href="favicon.ico" />
            </Head>
            <Navigation />
            <main>
                <Container>
                    <Row>
                        <Col>
                            <h1 className="py-4">Create a Questionnaire</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {loading && <p>Loading...</p>}
                            {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                            {data && <QuestionnaireOptions questionnaire={data.getQuestionnaire} />}
                        </Col>
                        <Col>
                            {data &&
                                data.getQuestionnaire.questions.map((question, index) => (
                                    <Question question={question} key={index} />
                                ))}
                        </Col>
                    </Row>
                </Container>
            </main>
        </div>
    );
};

const QuestionnaireOptions = ({ questionnaire }) => {
    return (
        <>
            <h5>Your Questionnaire</h5>
            <TitleForm />
            <h5>Add a Question</h5>
            <AddQuestionForm questionnaire={questionnaire} />
            <h5>Add Paragraph Section</h5>
            <AddTextSection />
        </>
    );
};

export default QuestionnaireCreatorPage;
