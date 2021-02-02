import { Card, ListGroup } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import styles from '../../styles/questionnaires.module.scss'

export const Response = ({ question }) => {
  const responses = question.responses.flat();
  let values = {};

  for (let i = 0; i < responses.length; i++) {
    if (responses[i] in values) {
      values[responses[i]]++;
    } else {
      values[responses[i]] = 1;
    }
  }

  const calculateColours = (opacity) => {
    let colourArr = [];
    for (let i = 0; i < Object.keys(values).length; i++) {
      colourArr.push(`rgba(${Math.floor(Math.random() * 200
        + 50)}, ${Math.floor(Math.random() * 200 + 50)}, ${Math.floor(Math.random() * 200 + 50)}, ${opacity} )`);
    }
    console.log(colourArr);
    return colourArr;
  }

  const data = {
    labels: Object.keys(values),
    datasets: [
      {
        label: '# of responses',
        data: Object.values(values),
        backgroundColor: calculateColours(1),
        borderColor: calculateColours(0.2),
        borderWidth: 1,
      }
    ]
  }

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }
  return (
    <Card>
      <Card.Header>
        <h3>{question.message}</h3>
        <h5>{question.description}</h5>
      </Card.Header>
      <Card.Body>
        {question.qType === "short" || question.qType === "long" ? <ListGroup className={styles.responseList}>
          {responses && responses.map(res => {
            return <ListGroup.Item key={res}>{res}</ListGroup.Item>
          })}
        </ListGroup> : <Bar data={data} options={options} />
        }
      </Card.Body>
    </Card>
  )
}

export default Response;
