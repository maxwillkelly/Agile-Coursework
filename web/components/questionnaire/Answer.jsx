import Card from 'react-bootstrap/Card';
import styles from '../styles/questionnaire.module.scss'
import FormControl from 'react-bootstrap/FormControl';
import RadioInput from './RadioInput';
import CheckboxInput from './CheckBoxInput';
import TextboxInput from './TextboxInput';

export const Answer = ({message, values, qType, qID, description, setAnswers, answers}) => {
  const renderType = () => {
    if (qType === "radio") {
      return (<RadioInput key={qID} values={values} qID={qID} setAnswers={setAnswers} answers={answers}/>)
    } else if (qType === "checkbox") {
      return (<CheckboxInput key={qID} values={values} qID={qID} setAnswers={setAnswers} answers={answers}/>)
    } else if (qType === "short" || qType === "long") {
      return (<TextboxInput key={qID} qID={qID} setAnswers={setAnswers} />)
    }
  } 

  return <Card className={styles.questionnaireCard}>
    <div className={styles.questionnaireQuestion}>
    <h3 className={styles.questionnaireQuestionTitle}>{message}</h3>
    <h6 className={styles.questionnaireQuestionDescription}>{description}</h6>
    </div>
    <div className={styles.questionnaireAnswerContainer}>
      {renderType()}
    </div>
  </Card>
}
export default Answer;




