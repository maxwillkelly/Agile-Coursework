import { gql } from '@apollo/client';

export const GET_STUDY_NOTES = gql`
    query GetStudyNotes($studyID: ID!) {
        getStudyNotes(studyID: $studyID) {
            _id
            title
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
                title
            }
            notes {
                _id
                timeStamp
                description
            }
        }
    }
`;

export const EXPORT_VIDEO_NOTE = gql`
    query ExportNotesAsCSV($videoNotesID: ID!) {
        exportNotesAsCSV(videoNotesID: $videoNotesID)
    }
`;
