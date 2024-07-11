import express from "express";
import { engine } from "express-handlebars";
import cookieSession from "cookie-session";
import presentations from "./db/presentations.json" with { type: "json" };
import fun_facts from "./db/fun_facts.json" with { type: "json" };
import searchPresentations from "./utils/search.js";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { mergePresentationsWithFavorites } from "./utils/favorites.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.resolve(__dirname, "./views"));

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["key1"],
    httpOnly: false,
    signed: false,
    maxAge: 365 * 24 * 60 * 60 * 1000, // one year
  }),
);
app.use((req, _, next) => {
  console.log(`request for ${req.path}`);
  next();
});

app.use((req, _, next) => {
  let favoritePresentations = req.session.favorite_presentations;
  if (favoritePresentations == null) {
    req.session.favorite_presentations = [];
  }

  next();
});

app.get("/", (_, res) => {
  const pres_index = new Date().getUTCHours() % presentations.length;
  const featured_presentation = presentations[pres_index];
  const fun_fact = fun_facts[Math.floor(Math.random() * fun_facts.length)];
  res.render("index", { featured_presentation, fun_fact });
});

app.get("/presentations", (req, res) => {
  const favorites = req.session.favorite_presentations;
  const presentationsWithFavorites = mergePresentationsWithFavorites(
    presentations,
    favorites,
  );

  res.render("presentations", {
    title: "Presentations",
    presentations: presentationsWithFavorites,
  });
});

app.get("/presentations/:id", (req, res) => {
  const presID = req.params.id;
  const favorites = req.session.favorite_presentations;
  const presentation = presentations.find(
    (presentation) => presentation._id == presID,
  );
  if (presentation == null) {
    res.render("404", { message: "Presentation not found" });
    return;
  }
  const favorited = favorites.includes(presentation._id);
  res.render("presentation_description", {
    title: presentation.name,
    presentation: { ...presentation, favorited },
  });
});

app.post("/fact", (_, res)=> {
  const fun_fact = fun_facts[Math.floor(Math.random() * fun_facts.length)];
  res.render("fact", { fun_fact, layout: false, })
})
app.post("/search", (req, res) => {
  const favorites = req.session.favorite_presentations;
  const presentationsFound = searchPresentations(
    req.body.search,
    presentations,
  );
  const presentationsWithFavorites = mergePresentationsWithFavorites(
    presentationsFound,
    favorites,
  );
  res.render("search", {
    presentations: presentationsWithFavorites,
    layout: false,
  });
});

app.put("/presentations/favorite/:id", (req, res) => {
  const id = req.params.id;
  let favorites = req.session.favorite_presentations;
  // what if id doesn't exist???

  // we'll toggle favorite on and off with this endpoint
  const isExistingFavorite = favorites.includes(id);
  favorites = isExistingFavorite
    ? favorites.filter((f) => f !== id)
    : [...favorites, id];

  req.session.favorite_presentations = favorites;
  res.render("favorited_response", {
    favorited: !isExistingFavorite,
    id,
    layout: false,
  });
});

app.listen(3000, () => {
  console.log("app listening on 3000");
});
