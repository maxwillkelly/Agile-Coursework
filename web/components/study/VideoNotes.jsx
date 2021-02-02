import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Button, Col, ListGroup } from 'react-bootstrap';
import Spinner from '../Spinner';
import { GET_STUDY_NOTES } from '../../queries/video';

const VideoNotesList = ({ studyID }) => {
    const { loading, error, data } = useQuery(GET_STUDY_NOTES, { variables: { studyID } });

    if (loading) return <Spinner />;
    if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;
    if (data)
        return (
            <div className="py-5 mb-5">
                <h5>Video Groups</h5>
                <ListGroup>
                    {data.getStudyNotes.map((studyNote) => (
                        <VideoNotesItem
                            studyID={studyID}
                            studyNote={studyNote}
                            key={studyNote._id}
                        />
                    ))}
                </ListGroup>
            </div>
        );
};

const VideoNotesItem = ({ studyID, studyNote }) => {
    const router = useRouter();
    const { title } = studyNote;
    return (
        <ListGroup.Item>
            <div className="d-flex align-items-center">
                <Col>
                    <p className="m-0">{title}</p>
                </Col>
                <Button
                    variant="primary"
                    onClick={() => router.push(`/studies/${studyID}/videos/${studyNote._id}`)}>
                    View
                </Button>
            </div>
        </ListGroup.Item>
    );
};

export default VideoNotesList;
