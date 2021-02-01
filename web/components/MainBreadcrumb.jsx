import { useRouter } from 'next/router';
import { Breadcrumb } from 'react-bootstrap';

const MainBreadcrumb = () => {
    const router = useRouter();
    const segments = router.pathname === '/' ? [''] : router.pathname.split('/');
    const activeSegment = segments[segments.length - 1];

    const hrefDictionary = {
        '': 'Home',
        admin: 'Admin',
        login: 'Login',
        studies: 'Studies',
        'studies/[studyId]': 'StudyName',
        'studies/[studyId]/questionnaire/[questionnaireId]/answer': 'Answer QuestionnaireName',
        'studies/[studyId]/questionnaire/[questionnaireId]/edit': 'Edit QuestionnaireName'
    };

    return (
        <Breadcrumb>
            {segments.map((href, i) => {
                const linkName = hrefDictionary[href];
                href = !href ? '/' : href;
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
    return (
        <Breadcrumb.Item onClick={() => router.push(href)} active={path === `/${href}`}>
            {children}
        </Breadcrumb.Item>
    );
};

export default MainBreadcrumb;
