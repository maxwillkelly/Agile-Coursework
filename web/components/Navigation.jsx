import Link from 'next/link';
import { Nav, Navbar } from 'react-bootstrap';

const Navigation = () => (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
        <Brand>Insert Site Name</Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
                <NavLink route="/">Home</NavLink>
                <NavLink route="/admin">Admin</NavLink>
                <NavLink route="/questionnaires">Questionnaires</NavLink>
                <NavLink route="/studies/users/dashboard">Users</NavLink>
                <NavLink route="/studies">Studies</NavLink>
            </Nav>
            <Nav>
                <NavLink route="/login">Login</NavLink>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

const Brand = ({ children }) => (
    <Link href="/" passHref>
        <Navbar.Brand>{children}</Navbar.Brand>
    </Link>
);

const NavLink = ({ children, route }) => (
    <Link href={route} passHref>
        <Nav.Link>{children}</Nav.Link>
    </Link>
);

export default Navigation;
