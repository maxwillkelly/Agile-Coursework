import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Col, Container, Row } from 'react-bootstrap';
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TitleForm from '../../../../../components/questionnaire/TitleForm';
import AddQuestionForm from '../../../../../components/questionnaire/AddQuestionForm';
import AddTextSection from '../../../../../components/questionnaire/AddTextSection';
import Question from '../../../../../components/questionnaire/Question';
import Navigation from '../../../../../components/Navigation';
import MainBreadcrumb from '../../../../../components/MainBreadcrumb';
import { GET_QUESTIONNAIRE } from '../../../../../queries/questionnaire';
import styles from '../../../../../styles/questionnaire-creator.module.scss';

const QuestionnaireCreatorPage = () => {
    const router = useRouter();
    const { loading, error, data, refetch } = useQuery(GET_QUESTIONNAIRE, {
        variables: { id: router.query.questionnaireId }
    });

    return (
        <div>
            <Head>
                <title>Create a Questionnaire</title>
            </Head>
            <Navigation />
            <MainBreadcrumb />
            <main>
                <Container>
                    <Row>
                        <Col>
                            <h1 className={styles.pageTitle}>Create a Questionnaire</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {loading && <p>Loading...</p>}
                            {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
                            {data && (
                                <QuestionnaireOptions
                                    questionnaire={data.getQuestionnaire}
                                    refetch={refetch}
                                />
                            )}
                        </Col>
                        <Col>
                            {data && (
                                <Questions
                                    questionnaire={data.getQuestionnaire}
                                    refetch={refetch}
                                />
                            )}
                        </Col>
                    </Row>
                </Container>
            </main>
        </div>
    );
};

const QuestionnaireOptions = ({ questionnaire, refetch }) => {
    return (
        <>
            <h5>Your Questionnaire</h5>
            <TitleForm questionnaire={questionnaire} />
            <h5 className={styles.addStuffCardTitle}>Add a Question</h5>
            <AddQuestionForm questionnaire={questionnaire} refetch={refetch} />
            <h5 className={styles.addStuffCardTitle}>Add Text Section</h5>
            <AddTextSection questionnaire={questionnaire} refetch={refetch} />
        </>
    );
};

const Questions = ({ questionnaire, refetch }) =>
    questionnaire.questions.map((question) => (
        <Question
            question={question}
            questionnaire={questionnaire}
            refetch={refetch}
            key={question.qID}
        />
    ));

export default QuestionnaireCreatorPage;
