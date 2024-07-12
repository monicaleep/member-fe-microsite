import fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const csv = fs.readFileSync(path.resolve(__dirname, "./presentation.csv"), {
  encoding: "utf8",
});
const [header, ...data] = csv.split("\r\n");
const headerMap = header.split(",").reduce((acc, header, idx) => {
  acc[idx] = header;
  return acc;
}, {});
console.log({ header, headerMap });
console.log(headerMap[2]);

const json = data.map((row) => {
  const columns = row.split(",");
  const rowObj = columns.reduce((acc, value, idx) => {
    const key = headerMap[idx];
    acc[key] = value;
    return acc;
  }, {});
  return rowObj;
});
console.log(json);

fs.writeFileSync(
  path.resolve(__dirname, "./presentation.json"),
  JSON.stringify(json, null, 2),
  { encoding: "utf8" },
);
