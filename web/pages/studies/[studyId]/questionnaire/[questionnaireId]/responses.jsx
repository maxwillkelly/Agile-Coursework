import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_RESPONSES } from '../../../../../queries/questionnaire';
import Navigation from '../../../../../components/Navigation';
import Response from '../../../../../components/questionnaire/Response'
import MainBreadcrumb from '../../../../../components/MainBreadcrumb';
import { Spinner } from 'react-bootstrap';

export const ResponsePage = () => {
  const router = useRouter();
  const questionnaireID = router.query.questionnaireId;
  const { loading, error, data, refetch } = useQuery(GET_RESPONSES, {
    variables: { questionnaireID }
  });

  if (loading) return (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  )

  if (error) return <pre>{JSON.stringify(error)}</pre>
  console.log(data.getResponses)
  return (
    <>
      <Head>
        <title>Responses</title>
      </Head>
      <Navigation />
      <MainBreadcrumb />
      <main>
        {data && data.getResponses[0].questionnaire.questions.map(question => (
          <Response answers={data.getResponses.answers.filter(answer => {
            return answer.qID === question.qID
          })} question={question} />
        ))}
      </main>
    </>
  )
}

export default ResponsePage;
