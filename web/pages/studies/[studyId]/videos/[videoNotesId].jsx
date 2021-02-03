import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Container, Col, ListGroup } from 'react-bootstrap';
import { Player } from 'video-react';

import Navigation from '../../../../components/Navigation';
import MainBreadcrumb from '../../../../components/MainBreadcrumb';
import Spinner from '../../../../components/Spinner';
import { GET_VIDEO_NOTES } from '../../../../queries/video';

const VideoPage = () => {
    const router = useRouter();
    const { loading, error, data } = useQuery(GET_VIDEO_NOTES, {
        variables: { videoNotesID: router.query.videoNotesId }
    });

    if (loading) return <Spinner />;
    if (error) return <pre>{JSON.stringify(error)}</pre>;
    if (data)
        return (
            <>
                <Head>
                    <title>Video</title>
                </Head>
                <Navigation />
                <MainBreadcrumb />
                <main>
                    <Container className="mt-3">
                        <h3 className="p-0 mt-4 mb-2">{data.getVideoNotes.title}</h3>
                        <VideoPlayback videos={data.getVideoNotes.videos} />
                        <Notes notes={data.getVideoNotes.notes} />
                    </Container>
                </main>
            </>
        );
};

const VideoPlayback = ({ videos }) =>
    videos.map((video) => (
        <div key={video._id}>
            <Player className="mb-4" src={video.link} />
            <h4 className="p-0 mb-4 mt-2">{video.title}</h4>
        </div>
    ));

const Notes = ({ notes }) => (
    <ListGroup>
        {notes.map((note) => (
            <Note note={note} key={note._id} />
        ))}
    </ListGroup>
);

const Note = ({ note }) => (
    <ListGroup.Item>
        <div className="d-flex">
            <Col>
                <p className="m-0">{note.timeStamp}</p>
            </Col>
            <Col>
                <p className="m-0">{note.description}</p>
            </Col>
        </div>
    </ListGroup.Item>
);

export default VideoPage;
