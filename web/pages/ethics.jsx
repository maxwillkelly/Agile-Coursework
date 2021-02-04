import { Component, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Col, ListGroup, Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import Navigation from '../components/Navigation';
import MainBreadcrumb from '../components/MainBreadcrumb';
import Spinner from '../components/Spinner';
import { GET_STUDY } from '../queries/study.js';
import { DocumentCreator } from '../components/ethics/ethicsFormCreator.ts';
import { generateDoc } from '../components/ethics/ethicsPacker.tsx';


const EthicsPage = ({ firstName, lastName, email, title, description }) => {
    const router = useRouter();
    const { loading, error, data } = useQuery(GET_STUDY, {
        variables: { id: '60103d9bec827463c8a40e34' }
    });

    if (loading) return <Spinner />;
    if (error) return <pre>{JSON.stringify(error)}</pre>;
    if (data)
        return (
            <>
                <Head>
                    <title>Ethics form</title>
                </Head>
                <Navigation />
                <MainBreadcrumb />
                <main>
                    <Container className="mt-3 mb-5">
                        <h3 className="p-0 mt-4 mb-2">Ethics form for "{data.getStudy.title}"</h3>

                        <FormInput
                            name={data.getStudy.staff[0].firstName}
                            email={data.getStudy.staff[0].email}
                            title={data.getStudy.description}
                            overview={data.getStudy.description}
                        />
                    </Container>
                </main>
            </>
        );
};

const FormInput = ({ name, email, title, overview }) => {
    const compileForm = async ({
        applicationType,
        school,
        coInvestigators,
        startDate,
        endDate,
        funder,
        version,
        level,
        supervisorName,
        aims,
        researchDesign,
        participantIdentification,
        consent,
        dataManagement1,
        dataManagement2,
        otherPerms,
        risks,
        otherConsiderations,
        documentation
    }) => {
        var doc = new DocumentCreator();

        try {
            doc.create(name, applicationType,school, email, title, coInvestigators, startDate, endDate, funder, version, level, supervisorName, overview, aims, researchDesign, participantIdentification, consent, dataManagement1, dataManagement2, otherPerms, risks, otherConsiderations, documentation );

            console.log("Cock");
            console.log(doc);

            // doc.createMain(doc, name, applicationType,school, email, title, coInvestigators, startDate, endDate, funder, version, level, supervisorName, overview, aims, researchDesign, participantIdentification, consent, dataManagement1, dataManagement2, otherPerms, risks, otherConsiderations, documentation );
         

            // doc.createSigniture('Principal Investigator or Student', doc);
            // doc.createSigniture('Supervisor (for applications from students)', doc);

            generateDoc(doc);
        } catch (err) {
            throw new Error(`Error ${err}`);
        }
    };

    return (
        <Formik
            initialValues={{
                applicationType: '',
                school: '',
                coInvestigators: '',
                startDate: '',
                endDate: '',
                funder: '',
                version: '',
                level: '',
                supervisorName: '',
                aims: '',
                researchDesign: '',
                participantIdentification: '',
                consent: '',
                dataManagement1: '',
                dataManagement2: '',
                otherPerms: '',
                risks: '',
                otherConsiderations: '',
                documentation: ''
            }}
            onSubmit={compileForm}>
            {({ values, handleChange, handleBlur, handleSubmit }) => (
                <Form className="mb-5" onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Module/Group application</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.applicationType}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>School</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.school}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Co-Investigators</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.coInvestigators}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.startDate}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.endDate}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Funder</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.funder}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Version</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.version}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Level</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.level}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Supervisor Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.supervisorName}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Aims and Objectives</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.aims}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Research Design and Methods</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.researchDesign}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Indentification and Recruitment of Participants</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.participantIdentification}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Informed Consent</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.consent}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Data Management: Lawful Processing of Data</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.dataManagement1}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Data Management: Planning</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.dataManagement2}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Other permissions</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.otherPerms}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Risks of Harm to Researchers and Participants</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.risks}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Other Ethical Considerations</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.otherConsiderations}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Documentation</Form.Label>
                        <Form.Control
                            type="text"
                            name="applicationType"
                            placeholder="n/a"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.documentation}
                        />
                    </Form.Group>
                    <Button className="mt-3 mb-5 float-right" variant="success" type="submit">
                        Add
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default EthicsPage;
