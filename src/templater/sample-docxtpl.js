const { execFile } = require("child_process");
const path = require("path");

const prjRootPath = path.resolve(__dirname, "..");

const pyScriptPath = path.resolve(prjRootPath, "scripts/sample-docxtpl.py");

execFile("python", [pyScriptPath]);
