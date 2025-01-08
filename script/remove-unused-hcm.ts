import fs from "node:fs";
import path from "node:path";

/** Recursively delete files in a directory. */
function deleteFilesInDirectory(startPath: string, removeTargetRegex: RegExp) {
  if (!fs.existsSync(startPath)) {
    console.log("Directory does not exist: ", startPath);
    return;
  }

  const files = fs.readdirSync(startPath);
  files.forEach((fileName) => {
    const filePath = path.join(startPath, fileName);
    const stat = fs.lstatSync(filePath);
    if (stat.isDirectory()) {
      // Recursion
      deleteFilesInDirectory(filePath, removeTargetRegex);
    } else if (removeTargetRegex.test(filePath)) {
      const scssBasePath = removeTargetRegex.exec(filePath)?.[1];
      const scssFilePath = `${scssBasePath}.scss`;
      if (fs.existsSync(scssFilePath)) return;
      console.log("Deleting file: ", filePath);
      fs.unlinkSync(filePath); // delete file.
    }
  });
}

// Search start directory
const targetDirectory = "./src";
// Target extension
const removeTargetRegex = /(.+)\.scss\.d\.ts(\.map)?$/;

// Run
deleteFilesInDirectory(targetDirectory, removeTargetRegex);
