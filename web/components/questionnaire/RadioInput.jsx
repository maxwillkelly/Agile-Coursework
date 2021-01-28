import Form from 'react-bootstrap/Form';
import styles from '../styles/questionnaire.module.scss';

export const RadioInput = ({values, qID}) => {
  return <div className={styles.questionnaireAnswerContainer}>
    {values && values.map(value => {
      return (
        <Form.Check label={value} id={`${qID}-${value}`} name={qID} type="radio"/>
      )
    })}
  </div>
}

export default RadioInput