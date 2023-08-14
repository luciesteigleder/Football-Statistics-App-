import cheerio from "cheerio";
import mongoose from "mongoose";
import {
  connection,
  //Player,
  Links,
  disconnectFromDatabase,
} from "./database.mjs";

export async function fetchData(axios) {
  // connection to the db
  try {
    await connection();
    console.log("Connection to the database established");

    let currentPage = 1;

    const response = await axios.get(
      `https://www.fifaindex.com/players/?page=${currentPage}`
    );
    const html = response.data;
    // console.log(html);
    const $ = cheerio.load(html);

    const linksArray = [];
    // Extracting links from the HTML
    $("a.link-player").each((index, element) => {
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

      // .then((savedLink) => {
      //   console.log("Document saved:", savedLink.toObject()); // Log the savedLink document after saving
      // })
      // .catch((error) => {
      //   //console.error("Error saving document here:", error);
      // });
      // } catch (error) {
      //   console.error("Error saving document:", error);
    }

    // console.log(links);

    // I have to select all the elements that have an attribute called 'data-playerid'
    // const players = $("[data-playerid]");
    // console.log(players);

    // Loop through the selected elements
    // for (const link of links) {
    //   const axiosInstance = axios.create({
    //     baseURL: "http://localhost:3002", // Update the base URL to use port 3002
    //   });
    //   console.log(link);
    //   const playerResponse = await axiosInstance.get(link);
    //   console.log(playerResponse);
    //   // const playerHtml = playerResponse.data;
    //   // const $player = cheerio.load(playerHtml);
    // }

    // const playerName = $player("h5.card-header").text();
    // const nationality = $player("a.link-nation").attr("title");
    // const rating = $player("span.rating").text();
    // const rating_OVR = rating.substring(0, 2);
    // const rating_POT = rating.substring(4 - 2);
    // const pref_pos = $player("a.link-position").attr("title");
    // let pref_position1;
    // let pref_position2;

    // if (pref_pos.length === 2) {
    //   pref_position1 = pref_pos;
    // } else if (pref_pos.length === 4) {
    //   pref_position1 = pref_pos.substring(0, 2);
    //   pref_position2 = pref_pos.substring(2);
    // }
    // const age = $player('td[data-title="Age"]').text();
    // const club_longName = $player("a.link-team").attr("title");
    // const club = club_longName.replace(" FIFA 23", "");
    // const img_url = $player("img.player").attr("src");

    // const playerHeight = $player('p:contains("Height")')
    //   .find("span.data-units-metric")
    //   .text();

    // const playerWeight = $player('p:contains("Weight")')
    //   .find("span.data-units-metric")
    //   .text();

    // const preferredFoot = $player('p:contains("Preferred Foot")')
    //   .find("span.float-right")
    //   .text();

    // const birthDate = $player('p:contains("Birth Date")')
    //   .find("span.float-right")
    //   .text();

    // const playerValue = $player('p:contains("Value")')
    //   .find("span.float-right")
    //   .text();

    // Create a new player document
    //   const newPlayer = new Player({
    //     playerName,
    //     nationality,
    //     rating_OVR,
    //     rating_POT,
    //     pref_position1,
    //     age,
    //     club,
    //     img_url,
    //     playerHeight,
    //     playerWeight,
    //     preferredFoot,
    //     birthDate,
    //     playerValue,
    //   });

    //   try {
    //     // Save the player document to the database
    //     await newPlayer.save();
    //     console.log("Player saved:", playerName);
    //   } catch (error) {
    //     console.error("Error saving player:", error);
    //   }
    // }

    // currentPage++;

    // Disconnect from the MongoDB database
    await disconnectFromDatabase();
    console.log("Disconnected from the database");
  } catch (error) {
    console.error("Error:", error);
  } // Closing bracket of the try block
}
