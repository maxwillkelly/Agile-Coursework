import * as saveAs from "file-saver";
import { Packer, Document } from "docx";


// Functionality adapted from https://github.com/dolanmiu/docx/blob/master/demo/browser-demo.html
export function generateDoc(doc: Document): void {
    Packer.toBlob(doc).then(blob => {
        saveAs(blob, "Non-Clinical-Research-Ethics-FORM-A-Low-Risk-Application-Form-v4-13032020.docx");
        console.log("Document created successfully");
    }).catch(err => {
        console.log("err", err);
    })
}

export default generateDoc