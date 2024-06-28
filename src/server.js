import express from "express";
import handlebars from "handlebars";
import fs from "fs";
import presentations from "./db/presentations.json" with { type: "json" };
import searchPresentations from "./utils/search.js";

const app = express();

const baseDir = "./src/";
function registerPartials() {
  const partialDir = `${baseDir}partials`;
  const partialFiles = fs.readdirSync(partialDir);
  partialFiles
    .filter((file) => file.endsWith(".hbs"))
    .forEach((file) => {
      const partialName = file.split(".")[0];
      console.log(`Registering Partial ${partialName}`);
      const partialHtml = fs.readFileSync(`${partialDir}/${file}`, {
        encoding: "utf8",
      });
      handlebars.registerPartial(partialName, partialHtml);
    });
}

function compileTemplates() {
  const templateFiles = fs.readdirSync(`${baseDir}templates`);

  const templateMap = {};
  templateFiles
    .filter((template) => template.endsWith(".hbs"))
    .forEach((template) => {
      // compile each template, store in map with key being filename
      const filePath = `${baseDir}templates/${template}`;
      const html = fs.readFileSync(filePath, { encoding: "utf8" });
      const templateName = template.split(".")[0];
      console.log(`Compiling template ${templateName}`);
      const compiledTemplate = handlebars.compile(html);
      templateMap[templateName] = compiledTemplate;
    });
  return templateMap;
}
const templateMap = compileTemplates();
registerPartials();
function render(templateName, data) {
  const template = templateMap[templateName];
  const html = template(data);
  return html;
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, _, next) => {
  console.log(`request for ${req.path}`);

  next();
});

app.get("/", (_, res) => {
  const html = render("index", { test: "hi there" });
  res.status(200).send(html);
});

app.get("/presentations", (_, res) => {
  const html = render("presentations", { presentations });
  res.status(200).send(html);
});

app.get("/presentations/:id", (req, res) => {
  //the id path
  const presID = req.params.id;
  const presentation = presentations.find(
    (presentation) => presentation._id == presID,
  );
  if (presentation == null) {
    res.status(404).send("<h1>Presentation not found</h1>");
    return
  }
  const html = render("presentation_description", {
    presentation: presentation,
  });
  res.status(200).send(html);
});

app.post("/search", (req, res) => {
  const presentationsFound = searchPresentations(
    req.body.search,
    presentations,
  );

  const html = render("search", { presentations: presentationsFound });
  res.status(200).send(html);
});

app.listen(3000, () => {
  console.log("app listening on 3000");
});
