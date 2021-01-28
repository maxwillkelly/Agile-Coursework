import Head from 'next/head';
import { useState} from 'react'; 
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { GET_QUESTIONNAIRE } from '../../../../queries/questionnaire';
import { Container } from 'react-bootstrap';
import Navigation from '../../../../components/Navigation';
import styles from '../../../../styles/questionnaires.module.scss';
import Answer from '../../../../components/questionnaire/Answer'

const AnswerPage = () => {
    const router = useRouter();
    const { loading, error, data } = useQuery(GET_QUESTIONNAIRE, {
        variables: { id: router.query.id }
    });
    console.log(router.query.id)

    if (loading) return <p>Loading questionnaire...</p>

    if (error || !data) {
        return <pre>{JSON.stringify(error) || "AHHhhhh!"}</pre> }
        else {
            console.log(data)
        } 
        return (
            <>
            <Head>
                <title>Blank</title>
            </Head>
            <Navigation />
            <main>
                <Container className={`${styles.questionnaireContainer}`}>
                    <h2>Answer Da Questions</h2>
                    {data && data.getQuestionnaire.questions.map(question => (
                        <Answer key={question.qID} {...question} />
                    ))}
                </Container>
            </main>
            </>
    );
};

export default AnswerPage;
