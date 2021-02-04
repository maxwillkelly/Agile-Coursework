import Head from 'next/head';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';

import { GET_QUESTIONNAIRE } from '../../../../../queries/questionnaire';
import Navigation from '../../../../../components/Navigation';
import styles from '../../../../../styles/questionnaires.module.scss';
import Answer from '../../../../../components/questionnaire/Answer';
import { SEND_RESPONSE } from '../../../../../mutations/questionnaire';

const AnswerPage = () => {
    const router = useRouter();
    const { loading, error, data } = useQuery(GET_QUESTIONNAIRE, {
        variables: { id: router.query.questionnaireId }
    });
    const [sendQuestionnaireResponse] = useMutation(SEND_RESPONSE);
    const [answers, setAnswers] = useState({});
    const [invalidAnswers, setInvalidAnswers] = useState({});
    if (loading) return <p>Loading questionnaire...</p>;

    if (error || !data) {
        return <pre>{JSON.stringify(error, null, 2) || 'AHHhhhh!'}</pre>;
    } else {
        // console.log(data);
    }

    const questions = data.getQuestionnaire.questions && data.getQuestionnaire.questions;

    const isValid = () => {
        let valid = true;
        for (let i = 0; i < questions.length; i++) {
            if (
                questions[i].required &&
                (!(questions[i].qID in answers) ||
                    answers[questions[i].qID].length === 0 ||
                    answers[questions[i].qID][0] === '')
            ) {
                valid = false;
                setInvalidAnswers((prev) => ({ ...prev, [questions[i].qID]: true }));
            } else {
                setInvalidAnswers((prev) => ({ ...prev, [questions[i].qID]: false }));
            }
        }
        return valid;
    };

    const handleSendResponse = (e) => {
        e.preventDefault();
        const submittableAnswers = [];

        if (!isValid()) {
            console.log('After today, go and treat yourself to a nice game of apex.');
            return;
        }

        for (const answer in answers) {
            submittableAnswers.push({
                qID: answer,
                values: answers[answer]
            });
        }

        sendQuestionnaireResponse({
            variables: {
                questionnaireID: data.getQuestionnaire.id,
                answers: submittableAnswers
            }
        }).then((res) => {
            console.log(res);

            router.push(
                `/studies/${data.getQuestionnaire.study.id}/questionnaire/${data.getQuestionnaire.id}/answer/thanks`
            );
        });
    };

    return (
        <>
            <Head>
                <title>{data.getQuestionnaire.title || 'Loading...'} </title>
            </Head>
            <Navigation />
            <main>
                <Container>
                    <Row className={styles.responseCard}>
                        <Col>
                            <Card>
                                <Card.Header>
                                    <h2>{data.getQuestionnaire.title}</h2>
                                    <h6>{data.getQuestionnaire.description}</h6>
                                </Card.Header>
                            </Card>
                        </Col>
                    </Row>

                    {questions &&
                        questions.map((question) => (
                            <Row className={styles.responseCard} key={question.qID}>
                                <Col>
                                    <Answer
                                        invalid={invalidAnswers[question.qID]}
                                        {...question}
                                        setAnswers={setAnswers}
                                        answers={answers}
                                    />
                                </Col>
                            </Row>
                        ))}
                    <Row className={styles.responseCard}>
                        <Col>
                            <Button onClick={handleSendResponse} variant="success">
                                Submit Response
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </main>
        </>
    );
};

export default AnswerPage;
