import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_QUESTION_RESPONSES, GET_QUESTIONNAIRE } from '../../../../../queries/questionnaire';
import Navigation from '../../../../../components/Navigation';
import Response from '../../../../../components/questionnaire/Response'
import MainBreadcrumb from '../../../../../components/MainBreadcrumb';
import { Spinner, Container, Row, Col, Card } from 'react-bootstrap';
import styles from '../../../../../styles/questionnaires.module.scss';

export const ResponsePage = () => {
  const router = useRouter();
  const questionnaireID = router.query.questionnaireId;
  const { loading, error, data, refetch } = useQuery(GET_QUESTION_RESPONSES, {
    variables: { questionnaireID }
  });
  const { loading: loadingTitle, error: errorTitle, data: newData } = useQuery(GET_QUESTIONNAIRE, { variables: { id: questionnaireID } })

  if (loading || loadingTitle) return (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  )

  if (error || errorTitle) return <pre>{JSON.stringify(error)}</pre>

  return (
    <>
      <Head>
        <title>Responses</title>
      </Head>
      <Navigation />
      <MainBreadcrumb />
      <Container >
        <Row className={styles.responseCard}>
          <Col>
            <Card>
              <Card.Header>
                <h2>Responses from {newData.getQuestionnaire && newData.getQuestionnaire.title}</h2>
              </Card.Header>
            </Card>
          </Col>
        </Row>
        {data && data.getQuestionResponses.map(question => <Row key={question.qID} className={styles.responseCard}><Col><Response question={question} /></Col></Row>)}
      </Container>
    </>
  )
};

export default ResponsePage;
