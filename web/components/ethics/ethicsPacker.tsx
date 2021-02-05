import * as saveAs from "file-saver";
import * as fs from "fs";
import { Packer, Document } from "docx";

export function generateDoc(doc: Document): void {
    console.log("Not yet");
    console.log('doc', doc);
    Packer.toBlob(doc).then(blob => {
        console.log('blob', blob);
        saveAs(blob, "Output.docx");
        console.log("Document created successfully");
    }).catch(err => {
        console.log("err", err);
    })
    // Packer.toBuffer(doc).then((buffer) => {
    //     fs.writeFileSync("My Document.docx", buffer);
    // });
    console.log("Yes")
}

export default generateDoc