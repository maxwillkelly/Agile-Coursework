import Card from 'react-bootstrap/Card';
import RadioInput from './RadioInput';
import CheckboxInput from './CheckboxInput';
import TextboxInput from './TextboxInput';
import styles from '../styles/questionnaire.module.scss';

export const Answer = ({
    message,
    values,
    qType,
    qID,
    description,
    setAnswers,
    answers,
    required,
    invalid
}) => {
    const renderType = () => {
        if (qType === 'radio') {
            return (
                <RadioInput
                    key={qID}
                    values={values}
                    qID={qID}
                    setAnswers={setAnswers}
                    answers={answers}
                    required={required}
                />
            );
        } else if (qType === 'checkbox') {
            return (
                <CheckboxInput
                    key={qID}
                    values={values}
                    qID={qID}
                    setAnswers={setAnswers}
                    answers={answers}
                    required={required}
                />
            );
        } else if (qType === 'short' || qType === 'long') {
            return <TextboxInput key={qID} qID={qID} setAnswers={setAnswers} required={required} />;
        }
    };

    return (
        <Card className={invalid && styles.invalidAnswerItem}>
            <Card.Header>
                <h3>
                    {message}
                    {required && <span className={styles.requiredLabel}>required</span>}
                </h3>
                <h5>{description}</h5>
            </Card.Header>
            <Card.Body>{renderType()}</Card.Body>
        </Card>
    );
};
export default Answer;
