import { gql } from '@apollo/client';

export const CREATE_QUESTIONNAIRE = gql`
    mutation CreateQuestionnaire($questionnaire: QuestionnaireInput!) {
        createQuestionnaire(questionnaire: $questionnaire) {
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

export const REMOVE_QUESTIONNAIRE = gql`
    mutation RemoveQuestionnaire($questionnaireID: ID!) {
        removeQuestionnaire(questionnaireID: $questionnaireID) {
            id
        }
    }
`;

export const ADD_QUESTION = gql`
    mutation AddQuestion($questionnaireID: ID!, $question: QuestionInput!) {
        addQuestion(questionnaireID: $questionnaireID, question: $question) {
            id
        }
    }
`;

export const REMOVE_QUESTION_FROM_QUESTIONNAIRE = gql`
    mutation RemoveQuestionFromQuestionnaire($questionnaireID: ID!, $questionID: ID!) {
        removeQuestionFromQuestionnaire(
            questionnaireID: $questionnaireID
            questionID: $questionID
        ) {
            id
        }
    }
`;

export const EDIT_QUESTION = gql`
    mutation EditQuestion(
        $questionnaireID: ID!
        $questionID: ID!
        $qType: String
        $order: Int
        $message: String
        $description: String
        $values: [String]
    ) {
        editQuestion(
            questionnaireID: $questionnaireID
            questionID: $questionID
            qType: $qType
            order: $order
            message: $message
            description: $description
            values: $values
        ) {
            id
        }
    }
`;

export const SEND_RESPONSE = gql`
    mutation CreateResponse($questionnaireID: ID!, $answers: [rValuesInput]) {
        createResponse(response: { questionnaireID: $questionnaireID, answers: $answers }) {
            id
            questionnaire {
                id
            }
            answers {
                qID
                values
            }
        }
    }
`;

export const BATCH_EDIT_QUESTIONS = gql`
    mutation BatchEditQuestion($questionnaireID: ID!, $questions: [updateQuestion]) {
        batchEditQuestions(questionnaireID: $questionnaireID, questions: $questions) {
            id
            title
        }
    }
`;
