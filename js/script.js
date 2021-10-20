const levelSelect = document.getElementById("difficulty-level-select");
const playBtn = document.getElementById("start-button");
const gridContainer = document.querySelector(".grid-container");
const scoreText = document.querySelector(".score-text");

let playerScore = 0;
let bombsArray = [];
let hintsArray = [];
let gameOver = false;
let cellNum = 0;

playBtn.addEventListener("click", function () {
  resetGame();
  const userLevel = parseInt(levelSelect.value);
  cellNum = getCellsNumber(userLevel);
  bombsArray = generateBombs(cellNum);
  hintsArray = generateHintsArray(bombsArray, cellNum);
  console.log(hintsArray);
  generateGrid(cellNum, bombsArray);
});

function generateGrid(cellsNumber, bombsArray) {
  const colNumber = Math.sqrt(cellsNumber);
  const cellSize = 100 / colNumber;
  for (let i = 1; i <= cellsNumber; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.style.width = `${cellSize}%`;
    cell.style.height = `${cellSize}%`;
    cell.cellIndex = i;
    if (!bombsArray.includes(i)) {
      cell.hint = countOccurrencesInArray(hintsArray, i);
      // cell.textContent = countOccurrencesInArray(hintsArray, i); // USED FOR DEBUG
    }
    const isBomb = bombsArray.includes(i);

    cell.addEventListener("click", onCellClick);

    gridContainer.appendChild(cell);
  }
}

function resetGame() {
  gridContainer.innerHTML = "";
  playerScore = 0;
  gameOver = false;
  updateScore();
}

function onCellClick() {
  if (!gameOver) {
    let isBomb = bombsArray.includes(this.cellIndex);
    if (!isBomb) {
      if (!this.classList.contains("selected")) {
        this.classList.add("selected");
        this.textContent = this.hint;
        playerScore++;
        if (playerScore === cellNum - bombsArray.length) {
          setGameOver();
        } else {
          updateScore();
        }
      }
    } else {
      this.classList.add("bomb");
      setGameOver();
    }
  }
}

function setGameOver() {
  discoverBombs();
  gameOver = true;
  let endText;
  if (playerScore === cellNum - bombsArray.length) {
    endText = "Well Done! you won! Play again!";
  } else {
    endText = `You lost. Your score was ${playerScore}! Try again.`;
  }
  updateScore(endText);
}

function updateScore(text = `Your score is ${playerScore}`) {
  scoreText.textContent = text;
}

function discoverBombs() {
  const cellsArray = gridContainer.children;
  for (let i = 0; i < cellsArray.length; i++) {
    const cell = cellsArray[i];
    if (bombsArray.includes(cell.cellIndex)) {
      cell.classList.add("bomb");
    }
  }
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

function generateHintsArray(bombsArray, cellsNumber) {
  const hintsArray = [];
  for (let i = 0; i < bombsArray.length; i++) {
    const bombIndex = bombsArray[i];
    const colsNumber = Math.sqrt(cellsNumber);
    let positionType = getCellPositionType(bombIndex, cellsNumber);

    switch (positionType) {
      case "top-left":
        hintsArray.push(bombIndex + colsNumber); // BOTTOM
        hintsArray.push(bombIndex + colsNumber + 1); // BOTTOM-RIGHT
        hintsArray.push(bombIndex + 1); // RIGHT
        break;
      case "bottom-left":
        hintsArray.push(bombIndex - colsNumber); // TOP
        hintsArray.push(bombIndex - colsNumber + 1); // TOP-RIGHT
        hintsArray.push(bombIndex + 1); // RIGHT
        break;
      case "top-right":
        hintsArray.push(bombIndex + colsNumber); // BOTTOM
        hintsArray.push(bombIndex + colsNumber - 1); // BOTTOM-LEFT
        hintsArray.push(bombIndex - 1); // LEFT
        break;
      case "bottom-right":
        hintsArray.push(bombIndex - colsNumber); // TOP
        hintsArray.push(bombIndex - colsNumber - 1); // TOP-LEFT
        hintsArray.push(bombIndex - 1); // LEFT
        break;
      case "right":
        hintsArray.push(bombIndex - colsNumber); // TOP
        hintsArray.push(bombIndex - colsNumber - 1); // TOP-LEFT
        hintsArray.push(bombIndex - 1); // LEFT
        hintsArray.push(bombIndex + colsNumber - 1); // BOTTOM-LEFT
        hintsArray.push(bombIndex + colsNumber); // BOTTOM
        break;
      case "left":
        hintsArray.push(bombIndex - colsNumber); // TOP
        hintsArray.push(bombIndex - colsNumber + 1); // TOP-RIGHT
        hintsArray.push(bombIndex + 1); // RIGHT
        hintsArray.push(bombIndex + colsNumber + 1); // BOTTOM-RIGHT
        hintsArray.push(bombIndex + colsNumber); // BOTTOM
        break;
      case "top":
        hintsArray.push(bombIndex - 1); // LEFT
        hintsArray.push(bombIndex + 1); // RIGHT
        hintsArray.push(bombIndex + colsNumber - 1); // BOTTOM-LEFT
        hintsArray.push(bombIndex + colsNumber + 1); // BOTTOM-RIGHT
        hintsArray.push(bombIndex + colsNumber); // BOTTOM
        break;
      case "bottom":
        hintsArray.push(bombIndex - 1); // LEFT
        hintsArray.push(bombIndex + 1); // RIGHT
        hintsArray.push(bombIndex - colsNumber - 1); // TOP-LEFT
        hintsArray.push(bombIndex - colsNumber + 1); // TOP-RIGHT
        hintsArray.push(bombIndex - colsNumber); // TOP
        break;
      default:
        hintsArray.push(bombIndex - colsNumber); // TOP
        hintsArray.push(bombIndex + colsNumber); // BOTTOM
        hintsArray.push(bombIndex - 1); // LEFT
        hintsArray.push(bombIndex + 1); // RIGHT
        hintsArray.push(bombIndex - colsNumber - 1); // TOP-LEFT
        hintsArray.push(bombIndex - colsNumber + 1); // TOP-RIGHT
        hintsArray.push(bombIndex + colsNumber - 1); // BOTTOM-LEFT
        hintsArray.push(bombIndex + colsNumber + 1); // BOTTOM-RIGHT
        break;
    }
  }
  return hintsArray;
}

function getCellPositionType(cellIndex, cellsNumber) {
  let columnsNumber = Math.sqrt(cellsNumber);
  if (cellIndex <= columnsNumber) {
    if (cellIndex === 1) {
      return "top-left";
    } else if (cellIndex === columnsNumber) {
      return "top-right";
    }
    return "top";
  } else if (cellIndex >= cellsNumber - columnsNumber + 1) {
    if (cellIndex === cellsNumber - columnsNumber + 1) {
      return "bottom-left";
    } else if (cellIndex === cellsNumber) {
      return "bottom-right";
    }
    return "bottom";
  } else if (cellIndex % columnsNumber == 0) {
    return "right";
  } else if ((cellIndex - 1) % columnsNumber == 0) {
    return "left";
  }
  return "standard";
}

function countOccurrencesInArray(array, valueToMatch) {
  let occurrences = 0;
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    if (value === valueToMatch) {
      occurrences++;
    }
  }
  return occurrences;
}
