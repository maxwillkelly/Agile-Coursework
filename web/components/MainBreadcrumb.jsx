import { useRouter } from 'next/router';
import { Breadcrumb } from 'react-bootstrap';
import lodash from 'lodash';

const MainBreadcrumb = () => {
    const router = useRouter();
    let segments = !router.asPath ? [''] : router.asPath.split('/');
    const activeSegment = segments[segments.length - 1];

    // console.log(router);
    // console.log(`segments: ${segments}`);
    // console.log(`activeSegment: ${activeSegment}`);

    const hrefDictionary = {
        '/admin': 'Admin',
        '/login': 'Login',
        '/studies': 'Studies',
        [`/studies/${router.query.studyId}`]: 'StudyName',
        [`/studies/${router.query.studyId}/questionnaire/${router.query.questionnaireId}/answer`]: 'Answer QuestionnaireName',
        [`/studies/${router.query.studyId}/questionnaire/${router.query.questionnaireId}/edit`]: 'Edit QuestionnaireName'
    };

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
