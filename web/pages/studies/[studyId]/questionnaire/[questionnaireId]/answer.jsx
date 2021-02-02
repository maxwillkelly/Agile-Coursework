import Head from 'next/head';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { Container, Button } from 'react-bootstrap';

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

        router.push('/studies/questionnaire/answer/thanks');
    };

    return (
        <>
            <Head>
                <title>{data.getQuestionnaire.title || 'Loading...'} </title>
            </Head>
            <Navigation />
            <MainBreadcrumb />
            <main>
                <Container className={styles.questionnaireContainer}>
                    <h1 className={itemStyles.questionnaireTitle}>{data.getQuestionnaire.title}</h1>
                    {data &&
                        data.getQuestionnaire.questions.map((question) => (
                            <Answer
                                key={question.qID}
                                {...question}
                                setAnswers={setAnswers}
                                answers={answers}
                            />
                        ))}
                    <Button onClick={handleSendResponse} variant="success">
                        Submit
                    </Button>
                </Container>
            </main>
        </>
    );
};

export default AnswerPage;
