import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import { Breadcrumb } from 'react-bootstrap';
import lodash from 'lodash';

const GET_STUDY_TITLE = gql`
    query GetStudy($id: ID!) {
        getStudy(id: $id) {
            title
        }
    }
`;

const GET_QUESTIONNAIRE_TITLE = gql`
    query GetQuestionnaire($id: ID!) {
        getQuestionnaire(id: $id) {
            title
        }
    }
`;

const MainBreadcrumb = () => {
    const router = useRouter();
    let segments = !router.asPath ? [''] : router.asPath.split('/');
    const activeSegment = segments[segments.length - 1];

    // console.log(router);
    // console.log(`segments: ${segments}`);
    // console.log(`activeSegment: ${activeSegment}`);

    const getStudyTitleQuery = useQuery(GET_STUDY_TITLE, {
        variables: { id: router.query.studyId }
    });

    const getQuestionnaireTitleQuery = useQuery(GET_QUESTIONNAIRE_TITLE, {
        variables: { id: router.query.questionnaireId }
    });

    const hrefDictionary = {
        '/admin': 'Admin',
        '/login': 'Login',
        '/studies': 'Studies'
    };

    let studyTitle = null;

    if (router.query.studyId) {
        const { loading, error, data } = getStudyTitleQuery;
        if (loading) return <p>Loading...</p>;
        if (error) return <pre>{JSON.stringify(error)}</pre>;
        if (!data) return null;

        studyTitle = data.getStudy.title;
        hrefDictionary[`/studies/${router.query.studyId}`] = studyTitle;
    }

    if (router.query.questionnaireId) {
        const { loading, error, data } = getQuestionnaireTitleQuery;

        if (loading) return <p>Loading...</p>;
        if (error) return <pre>{JSON.stringify(error)}</pre>;
        if (!data) return null;

        const questionnaireTitle = data.getQuestionnaire.title;

        hrefDictionary[
            `/studies/${router.query.studyId}/questionnaire/${router.query.questionnaireId}/answer`
        ] = `Answer ${questionnaireTitle}`;

        hrefDictionary[
            `/studies/${router.query.studyId}/questionnaire/${router.query.questionnaireId}/edit`
        ] = `Edit ${questionnaireTitle}`;

        hrefDictionary[
            `/studies/${router.query.studyId}/questionnaire/${router.query.questionnaireId}/responses`
        ] = 'Responses';
    }

    return (
        <Breadcrumb>
            {segments.map((snippet, i) => {
                let href = lodash.take(segments, i + 1).join('/');
                const linkName = hrefDictionary[href];

                // console.log(`href: ${href}`);
                // console.log(`linkName: ${linkName}`);

                return (
                    <MyBreadcrumbItem href={href} activeSegment={activeSegment} key={i}>
                        {linkName ? linkName : href}
                    </MyBreadcrumbItem>
                );
            })}
        </Breadcrumb>
    );
};

const MyBreadcrumbItem = ({ children, href }) => {
    const router = useRouter();
    const path = router.pathname === '/' ? `/${router.pathname}` : router.pathname;
    if (
        href === '' ||
        href.endsWith('questionnaire') ||
        href.endsWith(router.query.questionnaireId)
    )
        return null;

    return (
        <Breadcrumb.Item onClick={() => router.push(href)} active={path === `/${href}`}>
            {children}
        </Breadcrumb.Item>
    );
};

export default MainBreadcrumb;
