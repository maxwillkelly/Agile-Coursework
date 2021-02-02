import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_QUESTION_RESPONSES } from '../../../../../queries/questionnaire';
import Navigation from '../../../../../components/Navigation';
import Response from '../../../../../components/questionnaire/Response'
import MainBreadcrumb from '../../../../../components/MainBreadcrumb';
import { Spinner, Container, Row, Col } from 'react-bootstrap';
import styles from '../../../../../styles/questionnaires.module.scss';

export const ResponsePage = () => {
  const router = useRouter();
  const questionnaireID = router.query.questionnaireId;
  const { loading, error, data, refetch } = useQuery(GET_QUESTION_RESPONSES, {
    variables: { questionnaireID }
  });

  if (loading) return (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  )

  if (error) return <pre>{JSON.stringify(error)}</pre>
  console.log('from the responses page', data.getQuestionResponses)
  return (
    <>
      <Head>
        <title>Responses</title>
      </Head>
      <Navigation />
      <MainBreadcrumb />
      <Container >
        {data && data.getQuestionResponses.map(question => <Row key={question.qID} className={styles.responseCard}><Col><Response question={question} /></Col></Row>)}
      </Container>
    </>
  )
};

export default ResponsePage;
