import { useContext } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import { useRouter } from 'next/router';
import { UserContext } from '../contexts';
import { Nav, Navbar, Image } from 'react-bootstrap';
import { logout } from '../libs/user';
import styles from '../styles/navbar.module.scss';

const Navigation = () => {
    const router = useRouter();
    const { userToken, setUserToken } = useContext(UserContext);

    const clickLogInOutButton = () => {
        if (userToken !== '') {
            setUserToken(null);
            logout();
        }
        router.push('/');
    };

    return (
        <Navbar className={styles.Nav} collapseOnSelect expand="md">
            <Brand>
                <Image src="/uod_shield_white.png" alt="University of Dundee Logo" width="24" />
                <p className={`${styles.brandText} ml-2 text-white`}>Agile AC31007</p>
            </Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                {/* <Nav className="mr-auto">
                    <NavLink route="/">Home</NavLink>
                    <NavLink route="/admin">Admin</NavLink>
                    <NavLink route="/studies/questionnaires">Questionnaires</NavLink>
                    <NavLink route="/studies">Studies</NavLink>
                </Nav> */}
                <Nav className="ml-auto">
                    <Nav.Link className="text-white" onClick={clickLogInOutButton}>
                        {!userToken ? 'Login' : 'Logout'}
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

const Brand = ({ children }) => (
    <Link href="/" passHref>
        <Navbar.Brand>{children}</Navbar.Brand>
    </Link>
);

// const NavLink = ({ children, route }) => (
//     <Link href={route} passHref>
//         <Nav.Link>{children}</Nav.Link>
//     </Link>
// );

export default Navigation;
