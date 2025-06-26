const carbone = require("carbone");
const fs = require("fs");
const path = require("path");

const prjRootPath = path.resolve(__dirname, "..");

const templatePath = path.resolve(
  prjRootPath,
  "templates/sample-carbone-tpl.docx"
);
const outputPath = path.resolve(
  prjRootPath,
  "output/sample-carbone-output.docx"
);

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

const options = { convertTo: "docx" };

carbone.render(templatePath, data, options, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }

  fs.writeFileSync(outputPath, result);
});
