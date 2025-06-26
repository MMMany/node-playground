const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const fs = require("fs");
const path = require("path");

const prjRootPath = path.resolve(__dirname, "..");

const templatePath = path.resolve(
  prjRootPath,
  "templates/sample-docxtemplater-tpl.docx"
);
const outputPath = path.resolve(
  prjRootPath,
  "output/sample-docxtemplater-output.docx"
);

const template = new PizZip(fs.readFileSync(templatePath, "binary"));

const data = {
  type_a: [
    { name: "james", cost: 1, sub: "abc" },
    { name: "peter", cost: 2, sub: "ABC" },
    { name: "john", cost: 3, sub: "1a2s" },
  ],
  type_b: [
    { name: "cole", cost: 10, sub: "toto" },
    { name: "jack", cost: 100, sub: undefined },
  ],
};

const options = {
  paragraphLoop: true,
  linebreaks: true,
};

const docx = new Docxtemplater(template, options);

docx.render(data);

fs.writeFileSync(outputPath, docx.toBuffer());
