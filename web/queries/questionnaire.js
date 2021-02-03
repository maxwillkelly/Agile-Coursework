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
                message:s
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

export const GET_CSV_OF_RESPONSES = gql`
    query GetCSVOfResponses($questionnaireID: ID!) {
        getCSVOfResponses(questionnaireID: $questionnaireID)
    }
`;


export const GET_QUESTION_RESPONSES = gql`
    query GetQuestionResponses($questionnaireID: ID!) {
        getQuestionResponses(questionnaireID: $questionnaireID) {
            qID
            qType
            message
            description
            values
            order
            responses
        }
    }
`

export const GET_NUMBER_OF_QUESTIONNAIRE_RESPONSES = gql`
    query GetNumberOfResponses($questionnaireID: ID!) {
        getNumberOfResponses(questionnaireID: $questionnaireID)
    }   
`;
