import { gql } from '@apollo/client';

const SET_NEW_USER = gql`
    mutation SetNewUser(
        $firstName: String!
        $lastName: String!
        $email: String!
        $password: String!
        $level: Int!
    ) {
        setNewUser(
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

export default SET_NEW_USER;
