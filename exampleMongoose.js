const mongoose = require('mongoose');

// Connection URL
const url = 'mongodb://localhost:27017/mydatabase';

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB successfully');

    // Define a schema for your collection
    const schema = new mongoose.Schema({
      // Define your schema fields here
      name: String,
      age: Number,
      // ...
    });

    // Define a model based on the schema
    const Model = mongoose.model('mycollection', schema);

    // Find the first document in the collection
    Model.findOne({}, (err, document) => {
      if (err) {
        console.log('Error finding document:', err);
        return;
      }

      console.log('First document:', document);
      mongoose.connection.close();
    });
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });