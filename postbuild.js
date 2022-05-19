// Imports
const fs = require("fs");

// Constants
const OVERRIDE_FILE_QA = "./dist/WHS/assets/overrides_qa.json";
const OVERRIDE_FILE_PROD = "./dist/WHS/assets/overrides_prod.json";

// Change name of build directory
fs.renameSync("./dist/frontend", `./dist/WHS`);

// Delete env overrides from build
fs.unlink(OVERRIDE_FILE_QA, (err) => {
  if (err) {
    console.error(err?.message);
    return;
  }
  console.log("File cleanup 1 of 2 complete.");
});

fs.unlink(OVERRIDE_FILE_PROD, (err) => {
  if (err) {
    console.error(err?.message);
    return;
  }
  console.log("File cleanup 2 of 2 complete.");
});
