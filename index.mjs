import express from "express";
import dotenv from "dotenv";
import axios from "axios";
import { fetchData } from "./scraping.mjs";
import { connection } from "./database.mjs";

dotenv.config();

//create the app
const app = express();
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//db
connection();

//scraping
//fetchData(axios);

//routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
