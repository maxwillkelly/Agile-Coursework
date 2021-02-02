import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { Container } from 'react-bootstrap';
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
                        {data.getVideoNotes.videos.map((video) => (
                            <Player src={video.link} key={video._id} />
                        ))}
                    </Container>
                </main>
            </>
        );
};

export default VideoPage;
