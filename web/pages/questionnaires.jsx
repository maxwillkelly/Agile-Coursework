import { useState, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Container, Col, ListGroup, Overlay, Tooltip } from 'react-bootstrap';
import copy from 'copy-to-clipboard';

import Navigation from '../components/Navigation';
import { GET_QUESTIONNAIRES } from '../queries/questionnaire';
import { CREATE_QUESTIONNAIRE, REMOVE_QUESTIONNAIRE } from '../mutations/questionnaire';
import styles from '../styles/questionnaires.module.scss';

const QuestionnairesPage = () => {
    const router = useRouter();
    const [createQuestionnaireMutation] = useMutation(CREATE_QUESTIONNAIRE);
    const getQuestionnaires = useQuery(GET_QUESTIONNAIRES);

    const createQuestionnaire = async () => {
        const questionnaire = {
            title: 'New Questionnaire',
            description: 'This is a new questionnaire',
            studyID: '60103d9bec827463c8a40e34'
        };
        const { data } = await createQuestionnaireMutation({
            variables: { questionnaire }
        });
        getQuestionnaires.refetch();
        router.push(`/studies/questionnaire/${data.createQuestionnaire.id}`);
    };

    return (
        <>
            <Head>
                <title>Questionnaires</title>
            </Head>
            <Navigation />
            <main>
                <Container className="mt-3">
                    <h2 className="mx-3 mt-5 mb-3">All Questionnaires</h2>
                    <Questionnaires
                        getQuestionnaires={getQuestionnaires}
                        refetch={getQuestionnaires.refetch}
                    />
                    <Button className="float-right mt-3" onClick={createQuestionnaire}>
                        Create Questionnaire
                    </Button>
                </Container>
            </main>
        </>
    );
};

const Questionnaires = ({ getQuestionnaires, refetch }) => {
    const { loading, error, data } = getQuestionnaires;

    if (loading) return <p>Loading...</p>;
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

    return (
        <ListGroup>
            {data.getQuestionnaires.map((q, i) => (
                <Questionnaire q={q} refetch={refetch} key={i} />
            ))}
        </ListGroup>
    );
};

const Questionnaire = ({ q, refetch }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [removeQuestionnaire] = useMutation(REMOVE_QUESTIONNAIRE);
    const router = useRouter();
    const buttonRef = useRef(null);

    const MAIN_PATH = '/studies/questionnaire';
    const VIEW_PATH = `${MAIN_PATH}/answer/${q.id}`;

    const copyToClipboard = (VIEW_PATH) => {
        copy(`${window.location.hostname}:${window.location.port}${VIEW_PATH}`);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
    };

    const deleteQuestionnaire = async (questionnaire) => {
        await removeQuestionnaire({ variables: { questionnaireID: questionnaire.id } });
        refetch();
    };

    return (
        <ListGroup.Item>
            <div className={styles.questionnaireItem}>
                <Col>
                    <p className="m-0">{q.title}</p>
                </Col>
                <Col>
                    <p className="m-0">{q.description}</p>
                </Col>
                <div>
                    <Button
                        variant="success"
                        ref={buttonRef}
                        onClick={() => copyToClipboard(VIEW_PATH)}>
                        Copy
                    </Button>
                    <Overlay target={buttonRef.current} show={showTooltip} placement="bottom">
                        {(props) => <Tooltip {...props}>Link copied!</Tooltip>}
                    </Overlay>

                    <Button
                        className="ml-4"
                        variant="primary"
                        onClick={() => router.push(VIEW_PATH)}>
                        View
                    </Button>

                    <Button
                        className="ml-4"
                        variant="secondary"
                        onClick={() => router.push(`${MAIN_PATH}/${q.id}`)}>
                        Edit
                    </Button>

                    <Button
                        className="ml-4"
                        variant="danger"
                        onClick={() => deleteQuestionnaire(q)}>
                        Delete
                    </Button>
                </div>
            </div>
        </ListGroup.Item>
    );
};

export default QuestionnairesPage;
