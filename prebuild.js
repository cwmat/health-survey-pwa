// Imports
const fs = require('fs');

// Constants
const ENV_QA = 'qa';
const ENV_PROD = 'prod';
const OVERRIDE_FILE = './src/assets/overrides.json';
const BUILD_PATH = './dist';

// Vars
let filePath = '';

// Arg Parse
const args = process.argv.slice(2);
console.log('args: ', args);

// First arg expects an env flag
if (args.length === 0) {
  console.log('No env flag provided');
  process.exit(1);
}

switch (args[0].toLowerCase()) {
  case ENV_QA:
    console.log(`Running pre-build for ${ENV_QA.toUpperCase()}.`);
    filePath = './src/assets/overrides_qa.json';
    break;
  case ENV_PROD:
    console.log(`Running pre-build for ${ENV_PROD.toUpperCase()}`);
    filePath = './src/assets/overrides_prod.json';
    break;
  default:
    console.log('Sorry, that is not something I know how to do.  Check env arg.');
    process.exit(1);
}

// Remove the contents of the build path
fs.rmdirSync(BUILD_PATH, { recursive: true });

// Update env overrides
fs.copyFile(filePath, OVERRIDE_FILE, (err) => {
    if (err) {
        console.error(err?.message)
        return;
    }
    console.log('overrides.json updated.');
    console.log('Prebuild complete.');
});