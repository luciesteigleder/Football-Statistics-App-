import cheerio from "cheerio";
import mongoose from "mongoose";
import { connection, Links, disconnectFromDatabase } from "./database.mjs";

export async function fetchData(axios) {
  // connection to the db
  try {
    await connection();
    console.log("Connection to the database established");

    let totalPages = 605;

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
      const response = await axios.get(
        `https://www.fifaindex.com/players/?page=${currentPage}`
      );
      const html = response.data;
      // console.log(html);
      const $ = cheerio.load(html);

      const linksArray = [];
      // Extracting links from the HTML
      $("td[data-title='Name'] a.link-player").each((index, element) => {
        const link = $(element).attr("href");
        linksArray.push(link);
      });
      console.log(linksArray);

      console.log(mongoose.connection.readyState);

      // Your code to insert documents
      for (const link of linksArray) {
        const newLink = new Links({
          link,
        });

        console.log("new link" + newLink); // Log the newLink document before saving

        // Save the document to the database
        await newLink
          .save()
          .then(() => {
            console.log("Link saved successfully");
          })
          .catch((error) => {
            console.error("Error saving link:", error);
          });
      }
    }
    // currentPage++;

    // Disconnect from the MongoDB database
    await disconnectFromDatabase();
    console.log("Disconnected from the database");
  } catch (error) {
    console.error("Error:", error);
  } // Closing bracket of the try block
}
