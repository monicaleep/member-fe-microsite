import express from "express";
import { engine } from "express-handlebars";
import cookieSession from "cookie-session";
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
  res.render("index", { test: "hi there" });
});

app.get("/presentations", (req, res) => {
  const favorites = req.session.favorite_presentations
  const presentationsWithFavorites = presentations.map((p) => ({
    ...p,
    favorited: favorites.includes(p._id),
  }));
  res.render("presentations", { presentations: presentationsWithFavorites });
});

app.get("/presentations/:id", (req, res) => {
  const presID = req.params.id;
  const favorites = req.session.favorite_presentations
  const presentation = presentations.find(
    (presentation) => presentation._id == presID,
  );
  if (presentation == null) {
    res.render("404", { message: "Presentation not found" });
    return;
  }
  const favorited = favorites.includes(presentation._id);
  res.render("presentation_description", {
    presentation: { ...presentation, favorited },
  });
});


app.post("/search", (req, res) => {
  const favorites = req.session.favorite_presentations
  const presentationsFound = searchPresentations(
    req.body.search,
    presentations,
  );
  // move into utility method?
  const presentationsWithFavorites = presentationsFound .map((p) => ({
    ...p,
    favorited: favorites.includes(p._id),
  }));

  res.render("search", { presentations: presentationsWithFavorites , layout: false });
});

app.put("/presentations/favorite/:id", (req, res) => {
  const id = req.params.id;
  let favorites = req.session.favorite_presentations
  // what if id doesn't exist???

  // we'll toggle favorite on and off with this endpoint
  const isExistingFavorite = favorites.includes(id);
  favorites = isExistingFavorite
    ? favorites.filter((f) => f !== id)
    : [...favorites, id];

  req.session.favorite_presentations = favorites
  res.render("favorited_response", {
    favorited: !isExistingFavorite,
    id,
    layout: false,
  });
});

app.listen(3000, () => {
  console.log("app listening on 3000");
});
