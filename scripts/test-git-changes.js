const { spawn } = require('child_process');
const { execSync } = require('child_process');

// Function to execute shell commands and capture output
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    const process = spawn(command, { shell: true, stdio: 'inherit' });

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Command failed with exit code ${code}`));
      } else {
        resolve();
      }
    });
  });
};

// Function to get the list of changed files between current branch and base branch
const getChangedFiles = (baseBranch) => {
  const command = `git diff --name-only ${baseBranch}...HEAD`;
  const output = execSync(command, { encoding: 'utf-8' });
  return output.split('\n').filter((file) => file.trim() !== '');
};

// Main function
const main = async () => {
  const baseBranchIndex = process.argv.indexOf('-b');
  let baseBranch = 'main'; // Default to 'main' if -b option is not provided

  const useUI = process.argv.indexOf('--ui') !== -1;

  if (baseBranchIndex !== -1 && baseBranchIndex < process.argv.length - 1) {
    baseBranch = process.argv[baseBranchIndex + 1];
  }

  const changedFiles = getChangedFiles(baseBranch);
  if (changedFiles.length === 0) {
    console.log('No changed files detected.');
  } else {
    console.log('Changed files:');
    console.log(changedFiles.join('\n'));
  }

  const command = `npx vitest ${useUI ? '--ui' : 'run'} ${changedFiles.join(' ')}`;
  console.log(`Running vitest with related mode for changed files...`);
  console.log(`Command: ${command}`);
  await executeCommand(command);
};

// Run the main function
main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
