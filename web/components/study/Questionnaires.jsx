import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import copy from 'copy-to-clipboard';
import { Button, ListGroup, Overlay, Spinner, Col, Tooltip } from 'react-bootstrap';
import { CREATE_QUESTIONNAIRE, REMOVE_QUESTIONNAIRE } from '../../mutations/questionnaire';
import { GET_STUDY_QUESTIONNAIRES, GET_CSV_OF_RESPONSES } from '../../queries/questionnaire';
import styles from '../../styles/studies.module.scss';

const QuestionnairesSection = ({ studyID }) => {
    const router = useRouter();
    const [createQuestionnaireMutation] = useMutation(CREATE_QUESTIONNAIRE);
    const getStudyQuestionnaires = useQuery(GET_STUDY_QUESTIONNAIRES, {
        variables: { studyID }
    });

    const createQuestionnaire = async () => {
        const questionnaire = {
            title: 'New Questionnaire',
            description: 'This is a new questionnaire',
            studyID
        };
        const { data } = await createQuestionnaireMutation({
            variables: { questionnaire }
        });
        getStudyQuestionnaires.refetch();
        router.push(`/studies/${studyID}/questionnaire/${data.createQuestionnaire.id}/edit`);
    };

    return (
        <div>
            <h5 className={styles.questionnairesTableHeader}>Questionnaires</h5>
            <Questionnaires
                getStudyQuestionnaires={getStudyQuestionnaires}
                refetch={getStudyQuestionnaires.refetch}
                studyID={studyID}
            />
            <Button className={styles.createQuestionnaireButton} onClick={createQuestionnaire}>
                Create Questionnaire
            </Button>
        </div>
    );
};

const Questionnaires = ({ getStudyQuestionnaires, refetch, studyID }) => {
    const { loading, error, data } = getStudyQuestionnaires;

    if (loading)
        return (
            <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner>
        );
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

    return (
        <ListGroup>
            {data.getStudyQuestionnaires.map((q, i) => (
                <Questionnaire q={q} refetch={refetch} studyID={studyID} key={i} />
            ))}
        </ListGroup>
    );
};

const Questionnaire = ({ q, refetch, studyID }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [removeQuestionnaire] = useMutation(REMOVE_QUESTIONNAIRE);
    const getCsvOfResponsesQuery = useQuery(GET_CSV_OF_RESPONSES, {
        variables: { questionnaireID: q.id }
    });
    const router = useRouter();
    const buttonRef = useRef(null);

    const MAIN_PATH = `/studies/${studyID}/questionnaire/${q.id}`;
    const VIEW_PATH = `${MAIN_PATH}/answer`;

    const copyToClipboard = (VIEW_PATH) => {
        copy(`${window.location.hostname}:${window.location.port}${VIEW_PATH}`);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
    };

    const deleteQuestionnaire = async (questionnaire) => {
        await removeQuestionnaire({ variables: { questionnaireID: questionnaire.id } });
        refetch();
    };

    const { loading, error, data } = getCsvOfResponsesQuery;
    if (loading) return <p>Loading...</p>;
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
    // if (data) return <pre>{JSON.stringify(data, null, 2)}</pre>;

    // const downloadCSV = async () => {
    //     const { loading, error, data } = getCsvOfResponsesQuery;
    //     if (loading) return <p>Loading...</p>;
    //     if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
    //     if (data) return;
    // };

    if (data)
        return (
            <ListGroup.Item>
                <div className={styles.questionnaireItem}>
                    <Col>
                        <p className={styles.studyInfo}>{q.title}</p>
                    </Col>
                    <Col>
                        <p className={styles.studyInfo}>{q.description}</p>
                    </Col>
                    <div>
                        <Button
                            variant="success"
                            ref={buttonRef}
                            size="sm"
                            onClick={() => copyToClipboard(VIEW_PATH)}>
                            Copy
                        </Button>
                        <Overlay target={buttonRef.current} show={showTooltip} placement="bottom">
                            {(props) => <Tooltip {...props}>Link copied!</Tooltip>}
                        </Overlay>

                        <Button
                            className={styles.questionnaireButton}
                            variant="primary"
                            size="sm"
                            onClick={() => router.push(VIEW_PATH)}>
                            View
                        </Button>

                        <Button
                            className={styles.questionnaireButton}
                            variant="secondary"
                            size="sm"
                            onClick={() => router.push(`${MAIN_PATH}/edit`)}>
                            Edit
                        </Button>

                        <a
                            href={getCsvOfResponsesQuery.data.getCSVOfResponses}
                            target="_blank"
                            rel="noopener noreferrer"
                            download>
                            <Button className={styles.questionnaireButton} variant="info" size="sm">
                                Export
                            </Button>
                        </a>

                        <Button
                            className={styles.questionnaireButton}
                            variant="danger"
                            size="sm"
                            onClick={() => deleteQuestionnaire(q)}>
                            Delete
                        </Button>
                    </div>
                </div>
            </ListGroup.Item>
        );
};

export default QuestionnairesSection;
