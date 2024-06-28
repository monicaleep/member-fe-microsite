import express from "express";
import {engine} from "express-handlebars"
import presentations from "./db/presentations.json" with { type: "json" };
import searchPresentations from "./utils/search.js";
import * as path from "node:path"
import {fileURLToPath} from "node:url"
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express();
app.engine(".hbs", engine({extname: ".hbs"}))
app.set("view engine", ".hbs")
app.set("views",path.resolve(__dirname,"./views"))

// const baseDir = "./src/";
// function registerPartials() {
//   const partialDir = `${baseDir}partials`;
//   const partialFiles = fs.readdirSync(partialDir);
//   partialFiles
//     .filter((file) => file.endsWith(".hbs"))
//     .forEach((file) => {
//       const partialName = file.split(".")[0];
//       console.log(`Registering Partial ${partialName}`);
//       const partialHtml = fs.readFileSync(`${partialDir}/${file}`, {
//         encoding: "utf8",
//       });
//       handlebars.registerPartial(partialName, partialHtml);
//     });
// }

// function compileTemplates() {
//   const templateFiles = fs.readdirSync(`${baseDir}templates`);

//   const templateMap = {};
//   templateFiles
//     .filter((template) => template.endsWith(".hbs"))
//     .forEach((template) => {
//       // compile each template, store in map with key being filename
//       const filePath = `${baseDir}templates/${template}`;
//       const html = fs.readFileSync(filePath, { encoding: "utf8" });
//       const templateName = template.split(".")[0];
//       console.log(`Compiling template ${templateName}`);
//       const compiledTemplate = handlebars.compile(html);
//       templateMap[templateName] = compiledTemplate;
//     });
//   return templateMap;
// }
// const templateMap = compileTemplates();
// registerPartials();
// function render(templateName, data) {
//   const template = templateMap[templateName];
//   const html = template(data);
//   return html;
// }
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _, next) => {
  console.log(`request for ${req.path}`);

  next();
});

app.get("/", (_, res) => {
  res.render("index", { test: "hi there" });
});

app.get("/presentations", (_, res) => {
  res.render("presentations", { presentations });
});

app.get("/presentations/:id", (req, res) => {
  //the id path
  const presID = req.params.id;
  const presentation = presentations.find(
    (presentation) => presentation._id == presID,
  );
  if (presentation == null) {
    res.render('404', {message:"Presentation not found"})
    return
  }
  res.render("presentation_description", {
    presentation: presentation,
  });
});

app.post("/search", (req, res) => {
  const presentationsFound = searchPresentations(
    req.body.search,
    presentations,
  );

  res.render("search", { presentations: presentationsFound , layout: false});
});

app.listen(3000, () => {
  console.log("app listening on 3000");
});
