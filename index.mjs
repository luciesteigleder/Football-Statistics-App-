import express from "express";
import cheerio from "cheerio";
import axios from "axios";
import dotenv from "dotenv";
//import { fetchData } from "./scraping.mjs";
//import { getPlayerAPI } from "./scrapingAll.mjs";
import { Player } from "./database.mjs";
import path from "path";
import { fileURLToPath } from "url";
import { Links } from "./database.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

//create the app
const app = express();
app.set("view engine", "ejs");
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//db
//connection();

//scraping
//fetchData(axios);

//Get data from the players
//getPlayerAPI();

//routes
app.get("/", (req, res) => {
  Player.find({})
    .then((players) => {
      res.render("index.ejs", { players });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Server error");
    });
});

app.get("/players/:id", (req, res) => {
  const playerID = req.params.id;
  console.log(playerID);
  Player.findById(playerID)
    .then((player) => {
      res.status(200).render("player.ejs", { player: player });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Server error");
    });
  // res.status(200).render("player.ejs", { playerID });
});

//create the API with the players links
app.get("/links", async (req, res) => {
  try {
    const links = await Links.find({});
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: "Error fetching links from the database" });
  }
});

app.listen(3002, () => {
  console.log("Server started on port 3002");
});
