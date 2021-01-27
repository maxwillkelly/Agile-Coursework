import { gql } from '@apollo/client';

export const CREATE_QUESTIONNAIRE = gql`
    mutation CreateQuestionaire($questionnaire: QuestionnaireInput!) {
        createQuestionaire(questionnaire: $questionnaire) {
            id
        }
    }
`;
