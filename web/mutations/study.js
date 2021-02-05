import { gql } from '@apollo/client';

export const CREATE_NEW_STUDY = gql`
    mutation CreateNewStudy($study: StudyInput) {
        createNewStudy(study: $study) {
            id
        }
    }
`;

export const EDIT_STUDY = gql`
    mutation EditStudy(
        $studyID: ID!
        $title: String
        $description: String
        $permissions: StudyPermissionsInput
    ) {
        editStudy(
            studyID: $studyID
            title: $title
            description: $description
            permissions: $permissions
        ) {
            id
        }
    }
`;

export const DELETE_STUDY = gql`
    mutation DeleteStudy($studyID: ID!) {
        deleteStudy(studyID: $studyID) {
            id
        }
    }
`;

export const ADD_STAFF_TO_STUDY = gql`
    mutation AddStaffToStudy($studyID: ID!, $staffID: ID!) {
        addStaffToStudy(studyID: $studyID, staffID: $staffID) {
            id
        }
    }
`;

export const REMOVE_STAFF_FROM_STUDY = gql`
    mutation RemoveStaffFromStudy($studyID: ID!, $staffID: ID!) {
        removeStaffFromStudy(studyID: $studyID, staffID: $staffID) {
            id
        }
    }
`;
