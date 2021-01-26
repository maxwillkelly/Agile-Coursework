import { gql } from '@apollo/client';

export const USERS_QUERY = gql`
    query getUsers {
        id
        firstName
        lastName
        level
        permission
        email
    }
`;
