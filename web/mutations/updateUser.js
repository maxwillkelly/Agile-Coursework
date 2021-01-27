import { gql } from '@apollo/client';

const UPDATE_USER = gql`
    mutation UpdateUser(
        $id: ID!
        $firstName: String
        $lastName: String
        $email: String
        $password: String
        $level: Int
    ) {
        updateUser(
            id: $id
            firstName: $firstName
            lastName: $lastName
            email: $email
            password: $password
            level: $level
        ) {
            id
            firstName
            lastName
            email
            level
        }
    }
`;

export default UPDATE_USER;
