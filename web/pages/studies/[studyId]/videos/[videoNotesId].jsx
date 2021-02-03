import { Component, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Col, ListGroup, Form, Button } from 'react-bootstrap';
import { Player } from 'video-react';
import { Formik } from 'Formik';

import Navigation from '../../../../components/Navigation';
import MainBreadcrumb from '../../../../components/MainBreadcrumb';
import Spinner from '../../../../components/Spinner';
import { GET_VIDEO_NOTES } from '../../../../queries/video';
import { ADD_NOTE_TO_VIDEO_NOTES } from '../../../../mutations/video';

const VideoPage = () => {
    const router = useRouter();
    const { loading, error, data, refetch } = useQuery(GET_VIDEO_NOTES, {
        variables: { videoNotesID: router.query.videoNotesId }
    });
    const playerRef = useRef(null);

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
                    <Container className="mt-3 mb-5">
                        <h3 className="p-0 mt-4 mb-2">{data.getVideoNotes.title}</h3>
                        <VideoPlayback videos={data.getVideoNotes.videos} playerRef={playerRef} />
                        <NoteInput playerRef={playerRef} refetch={refetch} />
                        <Notes notes={data.getVideoNotes.notes} />
                    </Container>
                </main>
            </>
        );
};

const VideoPlayback = ({ videos, playerRef }) => {
    return videos.map((video) => <VideoPlayer {...video} key={video._id} ref={playerRef} />);
};

class VideoPlayer extends Component {
    constructor(props, context) {
        super(props, context);
    }

    getTimeStamp() {
        const { player } = this.player.getState();
        return new Date(player.currentTime * 1000).toISOString().substr(11, 8);
    }

    render() {
        return (
            <>
                <Player
                    className="mb-4"
                    ref={(player) => (this.player = player)}
                    src={this.props.link}
                />
                <h4 className="p-0 mb-4 mt-2">{this.props.title}</h4>
            </>
        );
    }
}

const Notes = ({ notes }) => (
    <ListGroup className="mb-5">
        {notes.map((note) => (
            <Note note={note} key={note._id} />
        ))}
    </ListGroup>
);

const NoteInput = ({ playerRef, refetch }) => {
    const [AddNoteToVideoNotes] = useMutation(ADD_NOTE_TO_VIDEO_NOTES);
    const router = useRouter();

    const addNote = async ({ description }) => {
        const variables = {
            videoNotesID: router.query.videoNotesId,
            note: {
                timeStamp: playerRef.current.getTimeStamp(),
                description
            }
        };
        await AddNoteToVideoNotes({ variables });
        refetch();
    };

    return (
        <Formik initialValues={{ description: '' }} onSubmit={addNote}>
            {({
                values,
                // errors,
                // touched,
                handleChange,
                handleBlur,
                handleSubmit
            }) => (
                <Form className="mb-5" onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>New note</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            placeholder="Type description here..."
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.description}
                        />
                        <Button className="mt-3 mb-5 float-right" variant="success" type="submit">
                            Add
                        </Button>
                    </Form.Group>
                </Form>
            )}
        </Formik>
    );
};

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
