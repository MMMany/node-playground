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
const metaPath = path.resolve(prjRootPath, "carbone-meta.json");

const data = JSON.parse(fs.readFileSync(metaPath));

const options = { convertTo: "docx" };

carbone.render(templatePath, data, options, (err, result) => {
  if (err) {
    console.error(err);
    return;
  }

  fs.writeFileSync(outputPath, result);
});

const mergedOutputPath = path.resolve(
  prjRootPath,
  "output/sample-carbone-merged-output.docx"
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
