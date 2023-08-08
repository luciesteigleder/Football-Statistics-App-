import cheerio from "cheerio";
import { Player, connection, disconnectFromDatabase } from "./database.mjs";

export async function fetchData(axios) {
  //connection to the db
  await connection();

  let currentPage = 1;
  // let hasNextPage = true;

  while (currentPage <= 10) {
    //________________this is for now limited to 10 pages

    const response = await axios.get(
      `https://www.fifaindex.com/players/?page=${currentPage}`
    );
    const html = response.data;
    const $ = cheerio.load(html);

    // I have to select all the elements that have a attribute called 'data-playerid'
    const players = $("[data-playerid]");

    // Loop through the selected elements
    for (const player of players) {
      const playerName = $(player).find("a.link-player").text();
      const nationality = $(player).find("a.link-nation").attr("title");
      const rating = $(player).find("span.rating").text();
      const rating_OVR = rating.substring(0, 2);
      const rating_POT = rating.substring(4 - 2);
      const pref_pos = $(player).find("span.position").text();
      let pref_position1;
      let pref_position2;

      if (pref_pos.length === 2) {
        pref_position1 = pref_pos;
      } else if (pref_pos.length === 4) {
        pref_position1 = pref_pos.substring(0, 2);
        pref_position2 = pref_pos.substring(2);
      }
      const age = $(player).find('td[data-title="Age"]').text();
      const club_longName = $(player).find("a.link-team").attr("title");
      const club = club_longName.replace(" FIFA 23", "");
      const img_url = $(player).find("img.player").attr("src");

      // Create a new player document
      const newPlayer = new Player({
        playerName,
        nationality,
        rating_OVR,
        rating_POT,
        pref_position1,
        age,
        club,
        img_url,
      });

      try {
        // Save the player document to the database
        await newPlayer.save();
        console.log("Player saved:", playerName);
      } catch (error) {
        console.error("Error saving player:", error);
      }
    }
    currentPage++;
  }

  // Disconnect from the MongoDB database
  await disconnectFromDatabase();
}

/*What do I want to get from the website:
- picture: img.player
- nationality: a.link-nation -> title
- rating (OVR POT): span.rating (1st one is OVR second is POT)
- name: a.class-link .text
- preferred position: a.link-position -> title
- age: td.data-title ="Age".text
- club: a.link-team -> title
*/
