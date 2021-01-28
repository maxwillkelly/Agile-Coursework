import { gql } from '@apollo/client';

export const GET_QUESTIONNAIRE = gql`
    query GetQuestionnaire($id: ID!) {
        getQuestionnaire(id: $id) {
            id
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

export const GET_QUESTIONNAIRES = gql`
    query {
        getQuestionnaires {
            id
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

export const GET_STUDY_QUESTIONNAIRES = gql`
    query GetStudyQuestionnaires($studyID: ID!) {
        getStudyQuestionnaires(studyID: $studyID) {
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
