import { useContext } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import { useRouter } from 'next/router';
import { UserContext } from '../contexts';
import { Nav, Navbar, Image } from 'react-bootstrap';
import { logout } from '../libs/user';
import styles from './styles/navbar.module.scss';

const Navigation = () => {
    const router = useRouter();
    const { userToken, setUserToken } = useContext(UserContext);

    const clickLogInOutButton = () => {
        if (userToken) {
            setUserToken(null);
            logout();
        }
        router.push('/');
    };

    return (
        <Navbar className={styles.Nav} collapseOnSelect expand="md">
            <Brand>
                <Image
                    src="/uod_shield_white.png"
                    alt="University of Dundee Logo"
                    width="35"
                    className={styles.uodLogo}
                />
                <h1 className={styles.brandText}>Agile AC31007</h1>
            </Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                {userToken && userToken.level === 2 && <AdminLinks />}
                <Nav className={styles.nav}>
                    <Nav.Link className={styles.navLink} onClick={clickLogInOutButton}>
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

const AdminLinks = () => (
    <>
        <NavLink route="/admin">Admin</NavLink>
        <NavLink route="/studies">Studies</NavLink>
    </>
);

const NavLink = ({ children, route }) => (
    <Link href={route} passHref>
        <Nav.Link className={styles.navLink}>{children}</Nav.Link>
    </Link>
);

export default Navigation;
