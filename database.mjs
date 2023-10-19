import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  playerName: String,
  nationality: String,
  rating_OVR: Number,
  rating_POT: Number,
  pref_position1: String,
  age: Number,
  club: String,
  img_url: String,
  playerHeight: String,
  playerWeight: String,
  preferredFoot: String,
  birthDate: String,
  playerValue: String,
});

const Player = mongoose.model("Player", playerSchema, "players");

const linksSchema = new mongoose.Schema({
  id: String,
  link: String,
});

const Links = mongoose.model("links", linksSchema, "links");

// Disconnect from the MongoDB database
async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
}

const connection = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "football",
    });
    console.log("MongoDB Atlas connected!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export { connection, Links, Player, disconnectFromDatabase };
