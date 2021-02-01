import { useRouter } from 'next/router';
import { Breadcrumb } from 'react-bootstrap';

const MainBreadcrumb = () => {
    const router = useRouter();
    const segments = router.pathname === '/' ? ['/'] : router.pathname.split('/');
    const activeSegment = segments[segments.length - 1];

    const hrefDictionary = {
        '/': 'Home',
        '/admin': 'Admin',
        '/questionnaires': 'Questionnaires',
        '/studies/questionnaires': 'Studies'
    };

    return (
        <Breadcrumb>
            {segments.map((href, i) => {
                const linkName = hrefDictionary[href];

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
    return (
        <Breadcrumb.Item href={href} active={router.pathname === href}>
            {children}
        </Breadcrumb.Item>
    );
};

export default MainBreadcrumb;
