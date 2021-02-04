import Card from 'react-bootstrap/Card';
import RadioInput from './RadioInput';
import CheckboxInput from './CheckboxInput';
import TextboxInput from './TextboxInput';

export const Answer = ({ message, values, qType, qID, description, setAnswers, answers }) => {
    const renderType = () => {
        if (qType === 'radio') {
            return (
                <RadioInput
                    key={qID}
                    values={values}
                    qID={qID}
                    setAnswers={setAnswers}
                    answers={answers}
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
                />
            );
        } else if (qType === 'short' || qType === 'long') {
            return <TextboxInput key={qID} qID={qID} setAnswers={setAnswers} />;
        }
    };

    return (
        <Card>
            <Card.Header>
                <h3>{message}</h3>
                <h5>{description}</h5>
            </Card.Header>
            <Card.Body>{renderType()}</Card.Body>
        </Card>
    );
};
export default Answer;
