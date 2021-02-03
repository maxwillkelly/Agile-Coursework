import Head from 'next/head';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';

import { GET_QUESTIONNAIRE } from '../../../../../queries/questionnaire';
import Navigation from '../../../../../components/Navigation';
import MainBreadcrumb from '../../../../../components/MainBreadcrumb';
import itemStyles from '../../../../../components/styles/questionnaire.module.scss';
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

    if (loading) return <p>Loading questionnaire...</p>;

    if (error || !data) {
        return <pre>{JSON.stringify(error, null, 2) || 'AHHhhhh!'}</pre>;
    } else {
        // console.log(data);
    }

    const handleSendResponse = () => {
        const submittableAnswers = [];

        for (const answer in answers) {
            submittableAnswers.push({
                qID: answer,
                values: answers[answer]
            });
        }

        // console.log(submittableAnswers);
        sendQuestionnaireResponse({
            variables: {
                questionnaireID: data.getQuestionnaire.id,
                answers: submittableAnswers
            }
        }).then((res) => {
            console.log(res);
        });

        router.push(`/studies/${data.getQuestionnaire.study.id}/questionnaire/${data.getQuestionnaire.id}/answer/thanks`);
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
                
                    
                    {data &&
                        data.getQuestionnaire.questions.map((question) => (
                            <Row className={styles.responseCard}>
                                <Col><Answer
                                    key={question.qID}
                                    {...question}
                                    setAnswers={setAnswers}
                                    answers={answers}
                                /></Col>
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
