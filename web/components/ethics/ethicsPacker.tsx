import { saveAs } from "file-saver";
import { Packer, Document } from "docx";



export function generateDoc(doc: Document): void {
    console.log("Not yet");
    Packer.toBlob(doc).then(blob => {
        console.log(blob);
        saveAs(blob, "Output.docx");
        console.log("Document created successfully");
    }),
    console.log("Yes")
}

export default generateDoc