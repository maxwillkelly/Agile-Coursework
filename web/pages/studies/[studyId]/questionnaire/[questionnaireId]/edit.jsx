import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import lodash from 'lodash';
import { Col, Container, Row } from 'react-bootstrap';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import TitleForm from '../../../../../components/questionnaire/TitleForm';
import AddQuestionForm from '../../../../../components/questionnaire/AddQuestionForm';
import AddTextSection from '../../../../../components/questionnaire/AddTextSection';
import QuestionDraggable from '../../../../../components/questionnaire/Question';
import Navigation from '../../../../../components/Navigation';
import MainBreadcrumb from '../../../../../components/MainBreadcrumb';
import { GET_QUESTIONNAIRE } from '../../../../../queries/questionnaire';
import { BATCH_EDIT_QUESTIONS } from '../../../../../mutations/questionnaire';
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

const QuestionsList = ({ questionnaire, questionList, refetch }) =>
    questionList.map((question, index) => (
        <QuestionDraggable
            question={question}
            questionnaire={questionnaire}
            index={index}
            refetch={refetch}
            key={question.qID}
        />
    ));

const Questions = ({ questionnaire, refetch }) => {
    const [questionList, setQuestionsList] = useState([]);
    const [batchEditQuestions] = useMutation(BATCH_EDIT_QUESTIONS);

    useEffect(() => {
        setQuestionsList(questionnaire.questions);
    }, []);

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const setOrder = (questions, startIndex, endIndex) => {
        const result = lodash.cloneDeep(questions);
        const changeOrder = startIndex > endIndex;
        const startVal = !changeOrder ? startIndex : endIndex;
        const endVal = !changeOrder ? endIndex : startIndex;

        for (let i = startVal; i <= endVal; i++) {
            result[i].order = i;
        }

        for (let q of result) {
            delete q.__typename;
        }
        return result;
    };

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        if (result.destination.index === result.source.index) {
            return;
        }

        const orderedQuestions = reorder(
            questionList,
            result.source.index,
            result.destination.index
        );
        const questions = setOrder(orderedQuestions, result.source.index, result.destination.index);

        // debugger;
        batchEditQuestions({
            variables: { questionnaireID: questionnaire.id, questions: questions }
        });
        setQuestionsList(questions);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        <QuestionsList
                            questionnaire={questionnaire}
                            questionList={questionList}
                            refetch={refetch}
                        />
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default QuestionnaireCreatorPage;
