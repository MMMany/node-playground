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
const metaPath = path.resolve(prjRootPath, "docxtemplater-meta.json");

const template = new PizZip(fs.readFileSync(templatePath, "binary"));

const data = JSON.parse(fs.readFileSync(metaPath));

const options = {
  paragraphLoop: true,
  linebreaks: true,
};

const docx = new Docxtemplater(template, options);

docx.render(data);

fs.writeFileSync(outputPath, docx.toBuffer());

const mergedOutputPath = path.resolve(
  prjRootPath,
  "output/sample-docxtemplater-merged-output.docx"
);

const { execFile } = require("child_process");

const pyScriptPath = path.resolve(prjRootPath, "scripts/sample-docxtpl.py");
const args = [
  pyScriptPath,
  "-t",
  outputPath,
  "-m",
  metaPath,
  "-o",
  mergedOutputPath,
];

// const util = require("util");
// const execFilePromise = util.promisify(execFile);
// async function run() {
//   try {
//     const { stdout, stderr } = await execFilePromise("python", args);
//     console.log(stdout);
//     if (stderr) {
//       console.error(stderr);
//     }
//   } catch (err) {
//     console.error(err);
//   }
// }
// run();

execFile("python", args, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error : ${err.name} / ${err.message}`);
    return;
  }
  console.log(stdout);
  if (stderr) {
    console.error(stderr);
  }
});
