const levelSelect = document.getElementById("difficulty-level-select");
const playBtn = document.getElementById("start-button");
const gridContainer = document.querySelector(".grid-container");

let playerScore = 0;
let bombsArray = [];

playBtn.addEventListener("click", function () {
  const userLevel = parseInt(levelSelect.value);
  const cellNum = getCellsNumber(userLevel);
  bombsArray = generateBombs(cellNum);
  generateGrid(cellNum, bombsArray);
});

function generateGrid(cellsNumber, bombsArray) {
  gridContainer.innerHTML = "";
  playerScore = 0;
  const colNumber = Math.sqrt(cellsNumber);
  const cellSize = 100 / colNumber;
  for (let i = 1; i <= cellsNumber; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.style.width = `${cellSize}%`;
    cell.style.height = `${cellSize}%`;
    cell.cellIndex = i;
    cell.textContent = i;
    const isBomb = bombsArray.includes(i);

    cell.addEventListener("click", onCellClick);

    gridContainer.appendChild(cell);
  }
}

function onCellClick() {
  if (!this.classList.contains("selected")) {
    this.classList.add("selected");
    playerScore++;
    console.log(playerScore);
  }
}
function onBombClick() {
  console.log("BOOOM");
}

/**
 * Returns the number of cells starting from the level id
 * @param {number} level
 * @returns {number}
 */
function getCellsNumber(level) {
  let cellNumber = 0;
  switch (parseInt(level)) {
    case 1:
      cellNumber = 100;
      break;
    case 2:
      cellNumber = 81;
      break;
    case 3:
      cellNumber = 49;
      break;
  }
  return cellNumber;
}

function generateBombs(cellsNumber, bombsNumber = 16) {
  const bombsArray = [];
  while (bombsArray.length < bombsNumber) {
    let randomNumber = generateRandomNumber(cellsNumber);
    let isAlreadyPresent = bombsArray.includes(randomNumber);
    if (!isAlreadyPresent) {
      bombsArray.push(randomNumber);
    }
  }
  console.log(bombsArray.toString());
  return bombsArray;
}

/**
 * Generate a random int between 1 and [maxNumber]
 * @param {number} maxNumber
 * @returns {number}
 */
function generateRandomNumber(maxNumber) {
  let randomNumber = Math.random();
  randomNumber = randomNumber * maxNumber + 1;
  randomNumber = Math.floor(randomNumber);
  return randomNumber;
}
