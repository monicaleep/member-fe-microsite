import express from "express";
import { engine } from "express-handlebars";
import presentations from "./db/presentations.json" with { type: "json" };
import searchPresentations from "./utils/search.js";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.resolve(__dirname, "./views"));

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
  const presentationsWithFavorites = presentations.map((p) => ({
    ...p,
    favorited: favorites.includes(p._id),
  }));
  res.render("presentations", { presentations: presentationsWithFavorites });
});

app.get("/presentations/:id", (req, res) => {
  const presID = req.params.id;
  const presentation = presentations.find(
    (presentation) => presentation._id == presID,
  );
  if (presentation == null) {
    res.render("404", { message: "Presentation not found" });
    return;
  }
  res.render("presentation_description", {
    presentation: presentation,
  });
});

// temporary to hold favorite state in server state until we get viewstate in place
const favorites = [ "2c3e35bd-5b08-4cd5-a537-6f056edd0a4e"];

app.post("/search", (req, res) => {
  const presentationsFound = searchPresentations(
    req.body.search,
    presentations,
  );

  res.render("search", { presentations: presentationsFound, layout: false });
});


app.listen(3000, () => {
  console.log("app listening on 3000");
});
