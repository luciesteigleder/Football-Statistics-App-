import cheerio from "cheerio";
import axios from "axios";
import {
  connection,
  Player,
  Links,
  disconnectFromDatabase,
} from "./database.mjs";

//function to get data from each page:
const getPlayerAPI = async () => {
  await connection();
  const links = await Links.find({});
  // const data = await response.json();
  // console.log(data.length);
  // for (let i = 0; i < data.length; i++) {
  for (let i = 0; i < links.length; i++) {
    console.log("i " + i);
    // console.log("data[i].link " + data[i].link);
    const link = links[i];
    console.log("TEST THIS INK");
    console.log(link);
    const playerLink = link.link;
    let playerURL = await getPlayerURL(playerLink);
    //console.log("playerURL " + playerURL);

    await getPlayerInfo(axios, playerURL);
    // i++;
  }
  disconnectFromDatabase();
};

const getPlayerURL = (link) => {
  //console.log(link);
  let playerURL = "https://www.fifaindex.com" + link;
  //console.log("getplayerURLfunction" + playerURL);
  return playerURL;
};

const getPlayerInfo = async (axios, playerURL) => {
  try {
    //let playerURL = await getPlayerAPI();
    console.log("WE TRY TO GET INFO");
    console.log(playerURL);
    const playerInfo = await axios.get(playerURL);
    const html = playerInfo.data;
    //console.log(html);
    const $ = await cheerio.load(html);

    const playerName = $("li.breadcrumb-item.active").text();
    const nationality = $("a.link-nation").attr("title");
    const image_nation = $("img.nation").attr("src");
    const pref_pos = $("a.link-position").attr("title");
    let pref_position1;
    let pref_position2;

    if (pref_pos.length === 2) {
      pref_position1 = pref_pos;
    } else if (pref_pos.length === 4) {
      pref_position1 = pref_pos.substring(0, 2);
      pref_position2 = pref_pos.substring(2);
    }

    const age = $('td[data-title="Age"]').text();
    const club_longName = $("a.link-team").attr("title");
    const club = club_longName.replace(" FIFA 23", "");
    const img_url = $("img.player").attr("src");

    const playerHeight = $('p:contains("Height")')
      .find("span.data-units-metric")
      .text();

    const playerWeight = $('p:contains("Weight")')
      .find("span.data-units-metric")
      .text();

    const preferredFoot = $('p:contains("Preferred Foot")')
      .find("span.float-right")
      .text();

    const birthDate = $('p:contains("Birth Date")')
      .find("span.float-right")
      .text();

    const playerValue = $('p:contains("Value")')
      .find("span.float-right")
      .text();

    const existingPlayer = await Player.findOne({ playerName });

    if (existingPlayer) {
      // Player already exists, update the document with new data
      existingPlayer.nationality = nationality;
      existingPlayer.image_nation = image_nation;
      existingPlayer.pref_position1 = pref_position1;
      existingPlayer.age = age;
      existingPlayer.club = club;
      existingPlayer.img_url = img_url;
      existingPlayer.playerHeight = playerHeight;
      existingPlayer.playerWeight = playerWeight;
      existingPlayer.preferredFoot = preferredFoot;
      existingPlayer.birthDate = birthDate;
      existingPlayer.playerValue = playerValue;
      // Update other player fields with new data

      try {
        await existingPlayer.save();
        console.log("Player updated:", playerName);
      } catch (error) {
        console.error("Error updating player:", error);
      }
    } else {
      // Player does not exist, create a new document
      const newPlayer = new Player({
        playerName,
        nationality,
        image_nation,
        pref_position1,
        club,
        img_url,
        playerHeight,
        playerWeight,
        preferredFoot,
        birthDate,
        playerValue,
        // Set other player fields
      });

      try {
        await newPlayer.save();
        console.log("Player saved:", playerName);
      } catch (error) {
        console.error("Error saving player:", error);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export { getPlayerAPI, getPlayerInfo };
