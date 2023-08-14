import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import { fetchData } from "./scraping.mjs";
import { connection } from "./database.mjs";
import { router } from "./api.mjs";
import path from "path";
import { fileURLToPath } from "url";
//import { Player } from "./database.mjs";

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
// connection();

//scraping
// fetchData(axios);

//get data from the api
app.use("/api", router);

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

app.listen(3002, () => {
  console.log("Server started on port 3002");
});
