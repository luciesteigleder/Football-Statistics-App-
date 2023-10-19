// Create a div element
const div = document.createElement("div");
div.className = "alphabet";

// Loop through the letters from A to Z
for (let letter of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
  // Create a button element
  const button = document.createElement("button");

  // Set the class and id for each button
  button.className = "letterButton";
  button.id = `${letter}Button`;

  // Set the text content of the button to the letter
  const span = document.createElement("span");
  const letterSpan = document.createTextNode(letter);
  span.appendChild(letterSpan);
  button.appendChild(span);

  // Append the button to the div
  div.appendChild(button);
}

// Append the div to the document body

let firstPlayers = document.querySelector(".playersSection");
firstPlayers.appendChild(div);

let buttons = document.querySelectorAll(".letterButton");

const letterListAppear = (letter) => {
  let specificLetterDiv = document.querySelectorAll(`#${letter}`);
  console.log(specificLetterDiv);
  specificLetterDiv.forEach((element) => {
    element.style.display = "block";
  });
};

const letterDivClear = () => {
  let allDivLetter = document.querySelectorAll(".letterList");
  allDivLetter.forEach((div) => {
    div.style.display = "none";
  });

  let allH3Letter = document.querySelectorAll("h3");
  allH3Letter.forEach((h3) => {
    h3.style.display = "none";
  });
};

buttons.forEach((element) => {
  let span = element.firstChild;
  span.addEventListener("click", (event) => {
    console.log("yes");
    let letter = event.target.innerText;
    console.log(letter);
    letterDivClear();
    letterListAppear(letter);
  });
});
