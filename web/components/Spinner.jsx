import { Spinner } from 'react-bootstrap';

const MySpinner = () => (
    <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
    </Spinner>
);

export default MySpinner;
