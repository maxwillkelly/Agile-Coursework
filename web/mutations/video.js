import { gql } from '@apollo/client';

export const ADD_NOTE_TO_VIDEO_NOTES = gql`
    mutation AddNoteToVideoNotes($videoNotesID: ID!, $note: NoteInput!) {
        addNoteToVideoNotes(videoNotesID: $videoNotesID, note: $note) {
            _id
        }
    }
`;
