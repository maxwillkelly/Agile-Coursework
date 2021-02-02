export const Response = ({ answers, question }) => {
  console.log(answers, question);
  return <><h2>{question.message}</h2><p>{answers.map(ans => <li>{ans}</li>)}</p></>
}

export default Response;
