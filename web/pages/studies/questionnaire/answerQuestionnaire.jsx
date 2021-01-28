import Head from 'next/head';
import { Container } from 'react-bootstrap';
import Navigation from '../../../components/Navigation';
import styles from '../../../styles/questionnaire.module.scss';

const AnswerPage = () => {
    return (
        <>
            <Head>
                <title>HG</title>
            </Head>
            <Navigation />
            <main>
                <Container className={`${styles.questionnaireContainer}`}>
                    <h2>Hey this is a heading for the page where you answer questions</h2>
                </Container>
            </main>
        </>
    );
};

export default AnswerPage;
