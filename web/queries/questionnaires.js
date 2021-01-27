import { gql } from '@apollo/client';

export const GET_QUESTIONNAIRES = gql`
    query {
        getQuestionnaires {
            title
            description
            studyID
            questions {
                qID
                qType
                message
                values
            }
        }
    }
`;
