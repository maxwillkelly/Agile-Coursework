import Head from 'next/head';
import { Col, Container, Row } from 'react-bootstrap';
import TitleForm from '../components/questionnaire/TitleForm';
import AddQuestionForm from '../components/questionnaire/AddQuestionForm';
import AddTextSection from '../components/questionnaire/AddTextSection';
// import styles from '../styles/questionnaire-creator.module.scss';

export default function QuestionairreCreatorPage() {
    return (
        <div>
            <Head>
                <title>Create a Questionnaire</title>
                <link rel="icon" href="favivon.ico" />
            </Head>

            <main>
                <Container>
                    <Row>
                        <Col>
                            <TitleForm />
                            <AddQuestionForm />
                            <AddTextSection />
                        </Col>

                        <Col>
                            <TitleForm />
                            <AddQuestionForm />
                            <AddTextSection />
                        </Col>
                    </Row>
                </Container>
            </main>
        </div>
    );
}
