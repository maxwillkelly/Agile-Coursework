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


export const GET_RESPONSES = gql`
    query GetResponses($questionnaireID: ID!) {
        getResponses(questionnaireID: $questionnaireID) {
            answers {
                values
                qID
            }
            questionnaire {
                title
                description
                questions {
                    qID
                    values
                    message
                    description
                    qType
                }
            }
        }
    }
`
