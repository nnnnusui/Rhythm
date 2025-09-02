/** @public */
export const openFileDialog = (p: {
  contentTypes: string;
}): Promise<File[]> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = p.contentTypes;
    input.onchange = () => {
      const files = input.files;
      if (!files) return reject(new Error("No files selected"));
      resolve(Array.from(files));
    };
    input.click();
  });
};
