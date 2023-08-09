// Make an AJAX request to fetch the data from the API
fetch("/api/players")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    // Process the data and update the HTML elements
    // const playersContainer = document.querySelector(".playerCardFrame");

    // data.forEach((player) => {
    //   //console.log(player);
    //   const playerDiv = document.createElement("div");
    //   playerDiv.innerHTML = `
    //           <h2>${player.playerName}</h2>
    //           <p>Nationality: ${player.nationality}</p>
    //           <p>Rating OVR: ${player.rating_OVR}</p>
    //           <p>Rating POT: ${player.rating_POT}</p>
    //           <p>Preferred Position: ${player.pref_position1}</p>
    //           <p>Age: ${player.age}</p>
    //           <p>Club: ${player.club}</p>
    //           <img src="${player.img_url}" alt="Player Image">
    //         `;
    //   playersContainer.appendChild(playerDiv);
    // });
  })
  .catch((error) => console.error(error));
