import Form from 'react-bootstrap/Form';
import styles from '../styles/questionnaire.module.scss';

export const CheckBox = ({ values, qID, setAnswers }) => {
  console.log(values)
  return <div>
    {values && values.map((value, idx) => {
      return (
        <Form.Check onChange={(e) => {
          const nodeVals = [];
          document.getElementsByName(qID).forEach(input => input.checked && nodeVals.push(input.labels[0].innerText));
            setAnswers(prev => ({ ...prev, [qID]: nodeVals }))
        }} size="lg" key={value} label={value} id={`${qID}-${value}`} name={qID} type="checkbox" className={styles.questionnaireAnswerItem} />
      )
    })}
  </div>
}

export default CheckBox