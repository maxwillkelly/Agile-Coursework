import { gql } from '@apollo/client';

export const GET_STUDY_NOTES = gql`
    query GetStudyNotes($studyID: ID!) {
        getStudyNotes(studyID: $studyID) {
            _id
            title
            videos {
                _id
                link
                type
            }
            notes {
                timeStamp
                description
            }
        }
    }
`;

export const GET_VIDEO_NOTES = gql`
    query GetVideoNotes($videoNotesID: ID!) {
        getVideoNotes(videoNotesID: $videoNotesID) {
            _id
            title
            videos {
                _id
                link
                type
            }
            notes {
                timeStamp
                description
            }
        }
    }
`;
