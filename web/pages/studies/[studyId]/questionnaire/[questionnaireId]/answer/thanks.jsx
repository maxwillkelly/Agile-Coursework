import Head from 'next/head';
import { Container } from 'react-bootstrap';
import Navigation from '../../../../../../components/Navigation';

const ThanksPage = () => {
    return (
        <>
            <Head>
                <title>Thank you</title>
            </Head>
            <Navigation />
            <main>
                <Container className="align-middle mt-5">
                    <h1 className="text-center">Thank you for participating in this study.</h1>
                </Container>
            </main>
        </>
    );
};

export default ThanksPage;
