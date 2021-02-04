import { gql } from '@apollo/client';

export const ADD_NOTE_TO_VIDEO_NOTES = gql`
    mutation AddNoteToVideoNotes($videoNotesID: ID!, $note: NoteInput!) {
        addNoteToVideoNotes(videoNotesID: $videoNotesID, note: $note) {
            _id
        }
    }
`;

export const DELETE_NOTE_FROM_VIDEO_NOTE = gql`
    mutation DeleteNotefromVideoNote($videoNotesID: ID!, $noteID: ID!) {
        deleteNotefromVideoNote(videoNotesID: $videoNotesID, noteID: $noteID) {
            _id
        }
    }
`;
