import { Form, Container, Card, FormControl } from 'react-bootstrap';
import { Formik, FieldArray } from 'formik';

const Question = ({ question }) => {
    return (
        <Container>
            <Card>
                <Formik
                    initialValues={{
                        title: question.title,
                        description: question.description,
                        questionOptions: question.options
                    }}>
                    {({
                        values,
                        // errors,
                        // touched,
                        handleChange,
                        handleBlur,
                        handleSubmit
                        // isSubmitting
                    }) => (
                        <Form onSubmit={handleSubmit}>
                            <FormControl
                                type="text"
                                name="title"
                                placeholder={question.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.title}
                            />
                            <FormControl
                                type="text"
                                name="description"
                                placeholder="Enter a description"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.description}
                            />
                            <FieldArray name="questionOptions">
                                {
                                    (/*arrayHelpers*/) => {
                                        return (
                                            <div>
                                                {question.options.map((option, index) => (
                                                    <FormControl
                                                        type="text"
                                                        name={index}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={option}
                                                        key={index}
                                                    />
                                                ))}
                                            </div>
                                        );
                                    }
                                }
                            </FieldArray>
                        </Form>
                    )}
                </Formik>
            </Card>
        </Container>
    );
};

export default Question;
