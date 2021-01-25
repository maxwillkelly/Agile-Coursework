import Head from 'next/head';
import { Container } from 'react-bootstrap';
import Login from '../components/Login';
import styles from '../styles/index.module.scss';

export default function IndexPage() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Agile Coursework</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <Container>
                    <div className={styles.login}>
                        <Login />
                    </div>
                </Container>
            </main>
        </div>
    );
}
