import Head from 'next/head';
import TitleForm from '../components/questionnaire/TitleForm';
import AddQuestionForm from '../components/questionnaire/AddQuestionForm';
// import styles from '../styles/questionnaire-creator.module.scss';

export default function QuestionairreCreatorPage() {
    return (
        <div>
            <Head>
                <title>Create a Questionnaire</title>
                <link rel="icon" href="favivon.ico" />
            </Head>

            <main>
                <TitleForm />
                <AddQuestionForm />
            </main>
        </div>
    );
}
