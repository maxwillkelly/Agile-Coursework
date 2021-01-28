import { gql } from '@apollo/client';

export const CREATE_QUESTIONNAIRE = gql`
    mutation CreateQuestionaire($questionnaire: QuestionnaireInput!) {
        createQuestionaire(questionnaire: $questionnaire) {
            id
        }
    }
`;

export const EDIT_QUESTIONNAIRE = gql`
    mutation EditQuestionnaire($questionnaireID: ID!, $title: String, $description: String) {
        editQuestionnaire(
            questionnaireID: $questionnaireID
            title: $title
            description: $description
        ) {
            id
        }
    }
`;

export const ADD_QUESTION = gql`
    mutation AddQuestion($questionnaireID: ID!, $question: QuestionInput) {
        addQuestion(questionnaireID: $questionnaireID, question: $question) {
            id
        }
    }
`;
