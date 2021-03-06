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
    return colourArr;
  }

  const data = {
    labels: Object.keys(values),
    datasets: [
      {
        label: 'Total',
        data: Object.values(values),
        backgroundColor: calculateColours(1),
        borderColor: calculateColours(0.2),
        borderWidth: 1,
      }
    ]
  }

  const options = {
    legend: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            stepSize: 1,
            suggestedMax: Math.ceil((Object.values(values).sort()[0] * 1.1) + 1)
          },
        },
      ],
    },
  }

  const renderGraph = () => {
    if (responses.length === 0) {
      return (
        <h3>N/A</h3>
      )
    } else if (question.qType === "short" || question.qType === "long") {
      return (
        <ListGroup className={styles.responseList}>
          {responses.length > 0 && responses.map(res => {
            return <ListGroup.Item key={res}>{res}</ListGroup.Item>
          })}
        </ListGroup>
      )
    } else {
      return <Bar data={data} options={options}/>
    }
  }

  return (
    <Card>
      <Card.Header>
        <h3>{question.message}</h3>
        <h5>{question.description}</h5>
      </Card.Header>
      <Card.Body>
        {renderGraph()}
      </Card.Body>
    </Card>
  )
}

export default Response;
