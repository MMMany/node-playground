const fs = require("fs");
const path = require("path");
const { diffAndExtract } = require("../src/json-handling");
const _ = require("lodash");
const util = require("util");

// Define paths
const assetsPath = path.join(__dirname, "..", "src", "assets");
const oldSetPath = path.join(assetsPath, "0-old-set.json");
const selectedSetPath = path.join(assetsPath, "99-selected.json");

// Load base files
const oldSet = JSON.parse(fs.readFileSync(oldSetPath, "utf8"));
const selectedSet = JSON.parse(fs.readFileSync(selectedSetPath, "utf8"));

// Test cases
const testCases = [
  "1-modified",
  "2-added",
  "3-deleted",
  "4-added-and-deleted",
  "4-added-and-deleted-L4-2", // To test the deletion in this file
];

// For the purpose of this test, we assume a targetLevel and compareKey.
const optionsMap = {
  "1-modified": {
    targetLevel: ["L1", "L2-1", "L3-1", "L4-1"],
    compareKey: "val",
  },
  "2-added": {
    targetLevel: ["L1", "L2-1", "L3-1", "L4-2"],
    compareKey: "val",
  },
  "3-deleted": {
    targetLevel: ["L1", "L2-1", "L3-1", "L4-2"], // Corrected path
    compareKey: "val",
  },
  "4-added-and-deleted": {
    targetLevel: ["L1", "L2-1", "L3-1", "L4-1"], // This tests the 'added' part
    compareKey: "val",
  },
  "4-added-and-deleted-L4-2": {
    targetLevel: ["L1", "L2-1", "L3-1", "L4-2"], // This tests the 'deleted' part
    file: "4-added-and-deleted", // use the same file
    compareKey: "val",
  },
};

testCases.forEach((testCase) => {
  console.log(`\n----- Running test case: ${testCase} -----`);

  const options = optionsMap[testCase];
  if (!options) {
    console.log(`Skipping test case ${testCase} due to missing options.`);
    return;
  }

  const fileName = options.file || testCase;
  const newSetPath = path.join(assetsPath, `${fileName}.json`);
  const newSet = JSON.parse(fs.readFileSync(newSetPath, "utf8"));

  const result = diffAndExtract(oldSet, newSet, selectedSet, options);

  console.log("--- Diff ---");
  console.log(util.inspect(result.diff, false, null, true));

  // Only check extracted result if it's not a special test case
  if (!options.file) {
    console.log("--- Extracted ---");
    const expectedExtractedPath = path.join(
      assetsPath,
      `${testCase}-result.json`
    );
    if (fs.existsSync(expectedExtractedPath)) {
      const expectedExtracted = JSON.parse(
        fs.readFileSync(expectedExtractedPath, "utf8")
      );
          if (_.isEqual(result.extracted, expectedExtracted)) {
            console.log("Extracted result matches expected result.");
          } else {
            console.log("Extracted result DOES NOT match expected result!");
          }    }
  }
});
