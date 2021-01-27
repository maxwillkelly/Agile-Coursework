import { gql } from '@apollo/client';

export const GET_STUDY = gql`
    query GetStudy($id: ID!) {
        getStudy(id: $id) {
            id
            title
            description
            staff {
                id
                firstName
                lastName
                level
                permission
                email
            }
            permissions {
                edit
                create
                delete
            }
        }
    }
`;

export const GET_STUDIES = gql`
    query {
        getStudies {
            id
            title
            description
            staff {
                id
                firstName
                lastName
                level
                permission
                email
            }
            permissions {
                edit
                create
                delete
            }
        }
    }
`;

export const GET_STAFF_STUDIES = gql`
    query GetStaffStudies($staffID: ID!) {
        getStaffStudies(staffID: $staffID) {
            id
            title
            description
            staff {
                id
                firstName
                lastName
                level
                permission
                email
            }
            permissions {
                edit
                create
                delete
            }
        }
    }
`;
