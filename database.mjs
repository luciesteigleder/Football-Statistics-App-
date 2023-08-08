import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  playerName: String,
  nationality: String,
  rating_OVR: Number,
  rating_POT: Number,
  pref_position1: String,
  age: Number,
  club: String,
  img_url: String
});

const Player = mongoose.model('Player', playerSchema);


//connection to the db
const connection = () => {
    mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }).then(() => {
    console.log('MongoDB Atlas connected!');
    }).catch(err => {
    console.log(err);
    });

}

// Disconnect from the MongoDB database
async function disconnectFromDatabase() {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
}

export { Player, connection, disconnectFromDatabase };