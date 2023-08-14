const playerID = window.location.pathname.split("/").pop();
console.log(playerID);

fetch(`/api/players/${playerID}`)
  .then((response) => response.json())
  .then((data) => {})
  .catch((error) => {
    // Handle any errors
    console.error(error);
  });
