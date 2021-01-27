import Head from 'next/head';
// import { useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import TitleForm from '../../../components/questionnaire/TitleForm';
import AddQuestionForm from '../../../components/questionnaire/AddQuestionForm';
import AddTextSection from '../../../components/questionnaire/AddTextSection';
import Question from '../../../components/questionnaire/Question';
import Navigation from '../../../components/Navigation';
// import styles from '../../../styles/questionnaire-creator.module.scss';

const questions = [
    {
        title: 'dogshit',
        description: 'This is some dogshit.',
        type: 'checkbox',
        options: ['shit', 'more shit', 'not shit']
    }
];

const QuestionnaireCreatorPage = () => {
    // const [questions, setQuestions] = useState([])

    return (
        <div>
            <Head>
                <title>Create a Questionnaire</title>
                <link rel="icon" href="favivon.ico" />
            </Head>
            <Navigation />
            <main>
                <h1>Questionnaire Page</h1>
                <Container>
                    <Row>
                        <Col>
                            <h5>Beens, pizza... APEX</h5>
                            <TitleForm />
                            <h5>Add a Question</h5>
                            <AddQuestionForm />
                            <h5>Add Paragraph Section</h5>
                            <AddTextSection />
                        </Col>

                        <Col>
                            {questions.map((question, index) => (
                                <Question question={question} key={index} />
                            ))}
                        </Col>
                    </Row>
                </Container>
            </main>
        </div>
    );
};

export default QuestionnaireCreatorPage;
