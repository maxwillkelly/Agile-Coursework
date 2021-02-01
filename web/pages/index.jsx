import Head from 'next/head';
import { Container } from 'react-bootstrap';
import Navigation from '../components/Navigation';
import MainBreadcrumb from '../components/MainBreadcrumb';
import styles from '../styles/index.module.scss';

export default function IndexPage() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Agile Coursework</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navigation />
            <MainBreadcrumb />
            <main className={styles.main}>
                <Container></Container>
            </main>
        </div>
    );
}
