import Card from 'react-bootstrap/Card';
import styles from '../styles/questionnaire.module.scss'
import FormControl from 'react-bootstrap/FormControl';
import RadioInput from './RadioInput';
import CheckboxInput from './CheckBoxInput';
import TextboxInput from './TextboxInput';

export const Answer = ({message, values, qType, qID}) => {
  const renderType = () => {
    if (qType === "radio") {
      return (<RadioInput values={values} qID={qID} />)
    } else if (qType === "checkBox") {
      return (<CheckboxInput values={values} qID={qID}/>)
    } else if (qType === "textbox") {
      return (<TextboxInput/>)
    }
  } 

  return <Card className={`${styles.questionnaireCard}`}>
    <h3 className={styles.questionnaireQuestion}>{message}</h3>
    <div className={styles.questionnaireAnswer}>
      {renderType()}
    </div>
  </Card>
}
export default Answer;




