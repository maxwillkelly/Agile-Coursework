import { gql } from '@apollo/client';

export const GET_QUESTIONNAIRE = gql`
    query GetQuestionnaire($id: ID!) {
        getQuestionnaire(id: $id) {
            id
            title
            description
            study {
                id
                title
                description
            }
            questions {
                qID
                qType
                message
                description
                values
            }
        }
    }
`;

export const GET_QUESTIONNAIRES = gql`
    query {
        getQuestionnaires {
            id
            title
            description
            study {
                id
                title
                description
            }
            questions {
                qID
                qType
                message
                values
            }
        }
    }
`;

export const GET_STUDY_QUESTIONNAIRES = gql`
    query GetStudyQuestionnaires($studyID: ID!) {
        getStudyQuestionnaires(studyID: $studyID) {
            title
            description
            study {
                id
                title
                description
            }
            questions {
                qID
                qType
                message
                values
            }
        }
    }
`;
