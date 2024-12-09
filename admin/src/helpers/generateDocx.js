const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");

const generateDocx = (templatePath, data, outputFilePath) => {
    const template = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(template);
    const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

    // Set the contract data
    doc.render(data);

    const buffer = doc.getZip().generate({ type: "nodebuffer" });

    fs.writeFileSync(outputFilePath, buffer);
};

// Example usage
const data = {
    title: "Contract",
    body: "This is an example contract content.",
};

generateDocx(
    path.join(__dirname, "contract_template.docx"),
    data,
    path.join(__dirname, "contract.docx")
);
