import { describe, expect, test } from '@jest/globals'

describe('Basic tests', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3)
  })
})

/*
const fs = require('fs/promises');
const path = require('path');

const CONFIG_FILE = 'config.json';

// Load the configuration asynchronously.
const loadConfig = async () => {
  try {
    const configData = await fs.readFile(CONFIG_FILE);
    return JSON.parse(configData);
  } catch (err) {
    console.error(`Error loading config file: ${err.message}`);
    process.exit(1);
  }
};

// Function to recursively iterate through a directory asynchronously.
const iterateDirectory = async (dirPath) => {
  try {
    const items = await fs.readdir(dirPath);

    await Promise.all(
      items.map(async (item) => {
        const itemPath = path.join(dirPath, item);
        const stats = await fs.stat(itemPath);

        if (stats.isDirectory()) {
          // Recursively iterate through the directory.
          await iterateDirectory(itemPath);
        } else {
          // Check if the file has the correct extension.
          if (itemPath.endsWith(config.fileEnding)) {
            await analyzeFile(itemPath);
          }
        }
      })
    );
  } catch (err) {
    console.error(`Error iterating directory: ${err.message}`);
  }
};

// Function to analyze a file asynchronously.
const analyzeFile = async (filePath) => {
  try {
    const lines = (await fs.readFile(filePath)).toString().split('\n');
    const matches = [];

    lines.forEach((line, lineNumber) => {
      // Check if the line matches any keywords, ignoring specified keywords.
      if (
        config.keywords.some((keyword) => line.includes(keyword)) &&
        !config.keywordsToIgnore.some((keyword) => line.includes(keyword))
      ) {
        matches.push({ line, lineNumber });
      }
    });

    // Print the matches if any.
    if (matches.length > 0) {
      console.log(`Matches found in file: ${filePath}`);
      console.log(matches);
    }
  } catch (err) {
    console.error(`Error analyzing file: ${err.message}`);
  }
};

// Main function.
const main = async () => {
  // Get the base directory from command-line arguments.
  if (process.argv.length < 3) {
    console.error('Usage: node script.js <base-directory>');
    process.exit(1);
  }

  const baseDirectory = process.argv[2];

  // Check if the base directory is valid.
  try {
    const stats = await fs.stat(baseDirectory);
    if (!stats.isDirectory()) {
      console.error(`Invalid base directory: ${baseDirectory}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`Error accessing base directory: ${err.message}`);
    process.exit(1);
  }

  // Load configuration and initiate directory iteration.
  const config = await loadConfig();
  await iterateDirectory(baseDirectory);
};

// Call the main function and handle any errors.
main().catch((err) => {
  console.error(`Error running script: ${err.message}`);
  process.exit(1);
});
*/
