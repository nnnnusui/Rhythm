/** @public */
export const downloadJson = (p: {
  data: unknown;
  filename: string;
}) => {
  const jsonText = JSON.stringify(p.data, null, 2) + "\n";
  const blob = new Blob([jsonText], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = p.filename;
  a.click();
  URL.revokeObjectURL(url);
};
