import { gql } from '@apollo/client';

const UPDATE_USER = gql`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id) {
            id
            firstName
            lastName
            email
            level
        }
    }
`;

export default UPDATE_USER;
