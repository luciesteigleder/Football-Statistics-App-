import express from "express";
const router = express.Router();
import { Player, connection, disconnectFromDatabase } from "./database.mjs";

router.get("/players", async (req, res) => {
  try {
    const players = await Player.find({});
    res.json(players);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

export { router };
