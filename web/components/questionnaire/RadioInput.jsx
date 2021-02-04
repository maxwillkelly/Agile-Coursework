import Form from 'react-bootstrap/Form';
import styles from '../styles/questionnaire.module.scss';

export const RadioInput = ({ values, qID, setAnswers }) => {
    return (
        <div>
            {values &&
                values.map((value, idx) => {
                    return (
                        <Form.Check
                            onChange={(e) => {
                                setAnswers((prev) => ({
                                    ...prev,
                                    [qID]: [e.target.labels[0].innerText]
                                }));
                            }}
                            size="lg"
                            key={`${value}-${idx}`}
                            label={value}
                            id={`${qID}-${value}`}
                            name={qID}
                            type="radio"
                            className={styles.questionnaireAnswerItem}
                        />
                    );
                })}
        </div>
    );
};

export default RadioInput;
