import express, {Router} from "express";
import { engine } from "express-handlebars";
import cookieSession from "cookie-session";
import presentations from "./db/presentations.json" with { type: "json" };
import fun_facts from "./db/fun_facts.json" with { type: "json" };
import searchPresentations from "./utils/search.js";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { mergePresentationsWithFavorites } from "./utils/favorites.js";
const url = import.meta.url
const dirname = url ? path.dirname(fileURLToPath(url)) : `./netlify/functions/`;


const app = express();
const router = Router()
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.resolve( "src/views"));

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
app.use("/public", express.static(path.resolve(dirname, "public")));


router.get("/", (_, res) => {
  const pres_index = new Date().getUTCHours() % presentations.length;
  const featured_presentation = presentations[pres_index];
  const fun_fact = fun_facts[Math.floor(Math.random() * fun_facts.length)];
  res.render("index", { featured_presentation, fun_fact });
});

router.get("/presentations", (req, res) => {
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

router.get("/presentations/:id", (req, res) => {
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

router.post("/fact", (_, res)=> {
  const fun_fact = fun_facts[Math.floor(Math.random() * fun_facts.length)];
  res.render("fact", { fun_fact, layout: false, })
})
router.post("/search", (req, res) => {
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

router.put("/presentations/favorite/:id", (req, res) => {
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

router.get('/hi', (req,res)=>{
  res.send('hi')
})

export {app, router}


