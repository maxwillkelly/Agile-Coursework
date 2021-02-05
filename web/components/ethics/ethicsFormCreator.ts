import {
    AlignmentType,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    TabStopPosition,
    TabStopType,
    TextRun,
    Table,
    TableRow,
    TableCell,
    WidthType,
    HeightRule,
    Spacing
} from "docx";
import { Break } from "docx/build/file/paragraph/run/break";
import { Bold } from "docx/build/file/paragraph/run/formatting";

export class DocumentCreator {
    // tslint:disable-next-line: typedef
    public create(name, applicationType, school, email, title, coInvestigators, startDate, endDate, funder, version, level, supervisorName, overview, aims, researchDesign, participantIdentification, consent, dataManagement1, dataManagement2, otherPerms, risks, otherConsiderations, documentation): Document {
        const document = new Document();

        this.createMain(
            document,
            name, applicationType, school, email, title, coInvestigators, startDate, endDate, funder, version, level, supervisorName, overview, aims, researchDesign, participantIdentification, consent, dataManagement1, dataManagement2, otherPerms, risks, otherConsiderations, documentation
        );
        this.createSignature("Principal Investigator or Student", document);
        this.createSignature(
            "Supervisor (for applications from students)",
            document
        );

        return document;
    }
    public createInputBox(input: string): Table {
        const inputBox = new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: `${input}` })]
                        })
                    ],
                    height: {
                        height: 1000,
                        rule: HeightRule.ATLEAST
                    }
                })
            ],
            width: {
                size: 10000,
                type: WidthType.DXA
            }
        });
        return inputBox;
    }
    public createMain(
        document: Document,
        name: string,
        applicationType: string,
        school: string,
        email: string,
        title: string,
        coInvestigators: string,
        startDate: string,
        endDate: string,
        funder: string,
        version: string,
        level: string,
        supervisorName: string,
        projectOverview: string,
        aims: string,
        researchDesign: string,
        participantIdentification: string,
        consent: string,
        dataManagement1: string,
        dataManagement2: string,
        otherPerms: string,
        risks: string,
        otherConsiderations: string,
        documentation: string
    ): string {
        const table_1 = new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("Name of Applicant")]
                        }),
                        new TableCell({
                            children: [new Paragraph(`${name}`)]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("Module/Group application")]
                        }),
                        new TableCell({
                            children: [new Paragraph(`${applicationType}`)]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("School")]
                        }),
                        new TableCell({
                            children: [new Paragraph(`${school}`)]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("University e-mail Address")]
                        }),
                        new TableCell({
                            children: [new Paragraph(`${email}`)]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("Title of projects")]
                        }),
                        new TableCell({
                            children: [new Paragraph(`${title}`)]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("Co-Investigators")]
                        }),
                        new TableCell({
                            children: [new Paragraph(`${coInvestigators}`)]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("Project Start Date")]
                        }),
                        new TableCell({
                            children: [new Paragraph(`${startDate}`)]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("Project End Date")]
                        }),
                        new TableCell({
                            children: [new Paragraph(`${endDate}`)]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("Funder")]
                        }),
                        new TableCell({
                            children: [new Paragraph(`${funder}`)]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph("Version of Application*")]
                        }),
                        new TableCell({
                            children: [new Paragraph(`${version}`)]
                        })
                    ]
                })
            ]
        });

        const table_2 = new Table({
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: "Students Only"
                                })
                            ],
                            columnSpan: 2
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text:
                                        "Level of Study (Undergraduate (UG); Taught Postgraduate (TPG); Research Postgraduate (RPG)"
                                })
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: `${level}`
                                })
                            ]
                        })
                    ]
                }),
                new TableRow({
                    children: [
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: "Name of University of Dundee Supervisor"
                                })
                            ]
                        }),
                        new TableCell({
                            children: [
                                new Paragraph({
                                    text: `${supervisorName}`
                                })
                            ]
                        })
                    ]
                })
            ]
        });

        document.addSection({
            children: [
                new Paragraph({
                    text:
                        "Ethical Approval for Non-Clinical Research Involving Human Participants",
                    alignment: AlignmentType.CENTER,
                    heading: HeadingLevel.TITLE
                }),
                //this.createContactInfo(PHONE_NUMBER, PROFILE_URL, EMAIL),
                new Paragraph({
                    text:
                        "FORM A: Application for ethical approval for low risk projects",
                    alignment: AlignmentType.CENTER,
                    heading: HeadingLevel.HEADING_1,
                    spacing: {
                        after: 1000
                    }
                }),

                table_1,

                new Paragraph({
                    text:
                        "*After revision, please update the version number before re-submission.",
                    spacing: {
                        before: 100,
                        after: 100
                    }
                }),
                table_2,
                new Paragraph({
                    text:
                        "Note: Students must copy in their supervisor when submitting the application for review.",
                    spacing: {
                        before: 100
                    }
                }),

                this.createHeading("1. Project Overview"),
                new Paragraph({
                    text:
                        "Please provide, with reference to the relevant literature, an overview of the research project providing a short explanation (maximum 400 words) of the research questions the project will address and why the study is justified."
                }),
                new Paragraph({
                    text:
                        "Please write this section in a way that is accessible to a person who is not an expert in your field."
                }),
                this.createInputBox(projectOverview),

                this.createHeading("2. Aims and Objectives"),
                new Paragraph({
                    text: "What are the aims and objectives of the project? "
                }),
                this.createInputBox(aims),

                this.createHeading("3. Research Design and Methods"),
                new Paragraph({
                    text:
                        "Please describe the design of your study and the research methods including information about any tasks or measuring instruments (validated or otherwise) that you will be using. If you are using non-validated instruments (e.g., surveys or questionnaires  you have designed, interview questions, observation protocols for ethnographic work or topic lists for unstructured data collection) please attach a copy to this ethics application. "
                }),
                this.createInputBox(researchDesign),

                this.createHeading("4. Identification and Recruitment of Participants"),
                new Paragraph({
                    text:
                        "How will participants be identified and recruited? Will your research involve participants outside of the UK? If so where?"
                }),
                new Paragraph({
                    text:
                        "Please provide details on how and by whom they will be contacted; please also add information on any exclusion criteria, should they apply. Please attach the wording of any emails, letters, social media adverts or other written approaches that you may use for recruitment purposes."
                }),
                this.createInputBox(participantIdentification),

                this.createHeading("5. Informed Consent"),
                new Paragraph({
                    text:
                        "How will you obtain informed consent? Are you satisfied that all participants have capacity to make their own decisions and understand the risks?"
                }),
                new Paragraph({
                    text:
                        "Please explain how and when participants will be informed about the scope of the research, what their involvement would entail and their rights under data protection legislation. Please provide the participant information sheet and consent form with this application; if consent is not obtained in written format (e.g., oral communication, deliberate action to opt-in to surveys or questionnaires), please provide details of how consent will be obtained and recorded. If the project involves photography or video- or audio-recording of participants, explicit consent will need to be given; where applicable this includes consent for someone not on the direct research team to have access to the participant’s data (e.g. for transcription). Explain how you have considered and will address consent for the preservation and potential sharing and reuse of data. "
                }),
                this.createInputBox(consent),

                this.createHeading("6a. Data Management: Lawful Processing of Data"),
                new Paragraph({
                    text:
                        "Data protection legislation  requires participants to be informed of the lawful basis for processing their personal data. At the University of Dundee, the normal basis for the lawful processing of personal data in research is that 'processing is necessary for the performance of a task carried out in the public interest or in the exercise of official authority vested in the controller'. If you intend to use another lawful basis you must contact the University’s Data Protection Officer (DPO) for advice and insert the lawful basis agreed with the DPO below."
                }),
                this.createInputBox(dataManagement1),

                this.createHeading("6b. Data Management: Planning"),
                new Paragraph({
                    text:
                        "Please describe your plan for managing the data  you will collect during your project and how it complies with data protection legislation. Include information on:"
                }),
                new Paragraph({
                    text:
                        "i) The type and volume of data; ii) Where and for how long will the data be stored and what measures will be in place to ensure secure storage; iii) Whether the data will be anonymised or pseudonymised ; iv) How secure access will be provided to data for collaborators; v) Whether and how data will be shared for reuse by other researchers beyond the project (including details on any access restrictions); vi) Processes in place to erase and/or stop processing an individual participant’s data (except where this would render impossible or seriously impair the research objectives) ; vii) Processes in place for individuals to have inaccurate personal data rectified, or completed if it is incomplete; viii) Who has overall responsibility for data management for the research project; ix) Arrangements for collection and transfer of data outside the UK."
                }),
                this.createInputBox(dataManagement2),

                this.createHeading("7. Other permissions"),
                new Paragraph({
                    text:
                        "Are any other permissions (e.g., from local authorities) required? If so which?"
                }),
                this.createInputBox(otherPerms),

                this.createHeading("8. Risks of Harm to Researchers and Participants"),
                new Paragraph({
                    text:
                        "Risks of harm. Please detail any risks associated with the project. Does the research involve fieldwork (either in the UK or overseas)? Does the research incur a risk of injury or ill-health above the level of risk prevalent in daily living? If yes, please complete the relevant risk assessment form(s) (general risk assessment form and/or the risk assessment for Travelling on University Work Overseas) and submit with this application."
                }),
                this.createInputBox(risks),

                this.createHeading("9. Other Ethical Considerations"),
                new Paragraph({
                    text:
                        "Are there any other ethical considerations relating to your project which have not been covered above? If so, please explain."
                }),
                this.createInputBox(otherConsiderations),

                this.createHeading("10. Documentation"),
                new Paragraph({
                    text:
                        "Please list all attached documentation, ensuring that each item has a date and version number."
                }),
                this.createInputBox(documentation)

                /*this.createHeading("Experience"),
                ...experiences
                  .map(position => {
                    const arr: Paragraph[] = [];
        
                    arr.push(
                      this.createInstitutionHeader(
                        position.company.name,
                        this.createPositionDateText(
                          position.startDate,
                          position.endDate,
                          position.isCurrent
                        )
                      )
                    );
                    arr.push(this.createRoleText(position.title));
        
                    const bulletPoints = this.splitParagraphIntoBullets(
                      position.summary
                    );
        
                    bulletPoints.forEach(bulletPoint => {
                      arr.push(this.createBullet(bulletPoint));
                    });
        
                    return arr;
                  })
                  .reduce((prev, curr) => prev.concat(curr), [])*/
            ]
        });

        return "ree";
    }

    public createSignature(title: string, document: Document): string {
        document.addSection({
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: `${title}`,
                            bold: true
                        })
                    ]
                }),
                new Paragraph({
                    text: "Name: \t\t\t\t\t Date:",
                    spacing: {
                        after: 250,
                        before: 250
                    }
                }),
                new Paragraph({
                    text: "Signature:",
                    spacing: {
                        after: 250
                    }
                })
            ]
        });
        return "ree";
    }

    public createHeading(text: string): Paragraph {
        return new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_1,
            thematicBreak: true,
            spacing: {
                before: 500,
                after: 100
            }
        });
    }

    public createSubHeading(text: string): Paragraph {
        return new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_2,
            spacing: {
                after: 500
            }
        });
    }
}
