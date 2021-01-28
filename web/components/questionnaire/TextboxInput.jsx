import Form from 'react-bootstrap/Form';
import styles from '../styles/questionnaire.module.scss';

export const RadioInput = ({ values, qID }) => {
  return <div className={styles.questionnaireAnswerContainer}>
    {values && values.map(value => {
      return (
        <Form.Text label={value} id={`${qID}-${value}`} name={qID}></Form.Text>
      )
    })}
  </div>
}

export default RadioInput