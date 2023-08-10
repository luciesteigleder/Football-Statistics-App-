import express from "express";
const router = express.Router();
import { Player } from "./database.mjs";

router.get("/players", async (req, res) => {
  try {
    const players = await Player.find({});
    res.json(players);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// const getPlayerIDbyIndex = (array, index) => {
//   for (let i = 0; i < array.length; i++) {
//     if (array[i]._id === index) {
//       return i;
//     }
//   }
//   return null;
// };

router.get("/players/:id", async (req, res) => {
  const playerID = req.params.id;
  try {
    const player = await Player.findById(playerID);
    if (player) {
      res.json(player);
    } else {
      res.status(404).json({ error: "Player not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});
//   const player = getPlayerIDbyIndex(Player, index); //change the Player i the params
//   if (player) {
//     res.json(player);
//   } else {
//     res.status(404).json({ error: "Player not found" });
//   }
// });

export { router };
