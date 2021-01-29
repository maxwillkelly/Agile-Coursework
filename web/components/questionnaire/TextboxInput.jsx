import Form from 'react-bootstrap/Form';
import styles from '../styles/questionnaire.module.scss';

export const TextboxInput = ({ qID, setAnswers }) => {
    return (
        <div>
            <Form.Control
                onChange={(e) => {
                    setAnswers((prev) => ({ ...prev, [qID]: [e.target.value] }));
                }}
                id={`${qID}-answer`}
                className={styles.questionnaireAnswerItem}
                placeholder="Enter text here..."
            />
        </div>
    );
};

export default TextboxInput;
