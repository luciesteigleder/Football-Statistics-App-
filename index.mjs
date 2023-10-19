import express from "express";
import cheerio from "cheerio";
import axios from "axios";
import dotenv from "dotenv";
//import { fetchData } from "./scraping.mjs";
import { getPlayerAPI, getPlayerInfo } from "./scrapingAll.mjs";
import { connection, Player, disconnectFromDatabase } from "./database.mjs";
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
// fetchData(axios);

//Get data from the players
// getPlayerAPI();
// getPlayerInfo(axios, "https://www.fifaindex.com/player/239085/erling-haaland/");

//routes
app.get("/", async (req, res) => {
  try {
    await connection();
    const players = await Player.find({}).limit(40);
    let allPlayersUnordered = await Player.find({});

    // Separate first name - family name

    let allUnOrderedNames = [];
    for (let i = 0; i < allPlayersUnordered.length; i++) {
      let playerNameRaw = allPlayersUnordered[i].playerName;

      let spaceIndex = playerNameRaw.indexOf(" ");
      let firstWord =
        spaceIndex === -1 ? playerNameRaw : playerNameRaw.slice(0, spaceIndex);
      let remainingString =
        spaceIndex === -1 ? "" : playerNameRaw.slice(spaceIndex + 1);

      let playerInfoName = {};
      playerInfoName.fullName = playerNameRaw;
      playerInfoName.firstName = firstWord;
      playerInfoName.secondName = remainingString || playerNameRaw;
      playerInfoName._id = allPlayersUnordered[i]._id;

      allUnOrderedNames.push(playerInfoName);
    }

    // Separate the players based on their secondName, in different arrays
    let allArrays = {};

    allUnOrderedNames.forEach((obj) => {
      let letter = obj.secondName.charAt(0).toUpperCase();

      if (!allArrays[letter]) {
        allArrays[letter] = [];
      }

      allArrays[letter].push(obj);
    });

    // Sort the players within each letter category
    let sortedArrays = {};

    Object.keys(allArrays)
      .sort()
      .forEach((letter) => {
        sortedArrays[letter] = allArrays[letter].sort((a, b) => {
          const secondNameA = a.secondName || a.fullName;
          const secondNameB = b.secondName || b.fullName;
          return secondNameA.localeCompare(secondNameB);
        });
      });

    res.render("index.ejs", { players, allArrays: sortedArrays });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get("/players/:id", async (req, res) => {
  try {
    await connection();
    const playerID = req.params.id;
    console.log("playerID " + playerID);
    let playerInfo = await Player.findById(playerID);
    console.log(playerInfo);
    res.status(200).render("player.ejs", { player: playerInfo });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
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
