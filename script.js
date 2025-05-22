const wordDisplay = document.getElementById("word-display");
const wrongLettersDisplay = document.getElementById("wrong-letters");
const letterInput = document.getElementById("letter-input");
const guessButton = document.getElementById("guess-button");
const resetButton = document.getElementById("reset-button");
const messageDisplay = document.getElementById("message");
const canvas = document.getElementById("hangman-canvas");
const ctx = canvas.getContext("2d");

let selectedWord = "";
let guessedLetters = [];
let wrongLetters = [];
let mistakes = 0;

const maxMistakes = 10;

// Drawing functions for hangman parts in order
const drawFunctions = [
  drawBase,
  drawPole,
  drawTopBeam,
  drawRope,
  drawHead,
  drawBody,
  drawLeftArm,
  drawRightArm,
  drawLeftLeg,
  drawRightLeg,
];

function fetchWord() {
  fetch("https://random-word-api.herokuapp.com/word")
    .then((res) => res.json())
    .then((data) => {
      selectedWord = data[0].toUpperCase();
      guessedLetters = [];
      wrongLetters = [];
      mistakes = 0;
      updateWordDisplay();
      updateWrongLetters();
      clearCanvas();
      messageDisplay.textContent = "";
      messageDisplay.className = "";
      letterInput.value = "";
      resetButton.style.display = "none"; 
      enableInput();
    })
    .catch(() => {
      messageDisplay.textContent = "Failed to load word. Please refresh.";
      messageDisplay.classList.add("lose");
    });
}

function updateWordDisplay() {
  const display = selectedWord
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");
  wordDisplay.textContent = display;
}

function updateWrongLetters() {
  wrongLettersDisplay.textContent =
    "Wrong Letters: " + wrongLetters.join(", ");
}

function drawBase() {
  // horizontal base line
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(10, 240);
  ctx.lineTo(290, 240);
  ctx.stroke();
}

function drawPole() {
  // vertical pole
  ctx.beginPath();
  ctx.moveTo(50, 240);
  ctx.lineTo(50, 20);
  ctx.stroke();
}

function drawTopBeam() {
  // top horizontal beam
  ctx.beginPath();
  ctx.moveTo(50, 20);
  ctx.lineTo(200, 20);
  ctx.stroke();
}

function drawRope() {
  // rope (short vertical line)
  ctx.beginPath();
  ctx.moveTo(200, 20);
  ctx.lineTo(200, 50);
  ctx.stroke();
}

function drawHead() {
  // circle head
  ctx.beginPath();
  ctx.arc(200, 70, 20, 0, Math.PI * 2);
  ctx.stroke();
}

function drawBody() {
  // vertical body line
  ctx.beginPath();
  ctx.moveTo(200, 90);
  ctx.lineTo(200, 150);
  ctx.stroke();
}

function drawLeftArm() {
  ctx.beginPath();
  ctx.moveTo(200, 110);
  ctx.lineTo(160, 130);
  ctx.stroke();
}

function drawRightArm() {
  ctx.beginPath();
  ctx.moveTo(200, 110);
  ctx.lineTo(240, 130);
  ctx.stroke();
}

function drawLeftLeg() {
  ctx.beginPath();
  ctx.moveTo(200, 150);
  ctx.lineTo(170, 190);
  ctx.stroke();
}

function drawRightLeg() {
  ctx.beginPath();
  ctx.moveTo(200, 150);
  ctx.lineTo(230, 190);
  ctx.stroke();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#000";
}

function disableInput() {
  letterInput.disabled = true;
  guessButton.disabled = true;
}

function enableInput() {
  letterInput.disabled = false;
  guessButton.disabled = false;
  letterInput.focus();
}

function endGame(win) {
  disableInput();
  resetButton.style.display = "inline-block"; // Show Play Again button
  if (win) {
    messageDisplay.textContent = "Congratulations! You won 🎉";
    messageDisplay.className = "win";
  } else {
    messageDisplay.textContent = `You lost! The word was: ${selectedWord}`;
    messageDisplay.className = "lose";
  }
}

function checkGameStatus() {
  // Check win
  let won = selectedWord.split("").every((letter) =>
    guessedLetters.includes(letter)
  );
  if (won) {
    endGame(true);
    return true;
  }
  // Check lose
  if (mistakes >= maxMistakes) {
    endGame(false);
    return true;
  }
  return false;
}

guessButton.addEventListener("click", () => {
  const letter = letterInput.value.toUpperCase();
  letterInput.value = "";

  if (!letter.match(/[A-Z]/) || letter.length !== 1) {
    alert("Please enter a valid letter A-Z.");
    return;
  }

  if (
    guessedLetters.includes(letter) ||
    wrongLetters.includes(letter)
  ) {
    alert("You already guessed that letter!");
    return;
  }

  if (selectedWord.includes(letter)) {
    guessedLetters.push(letter);
    updateWordDisplay();
  } else {
    wrongLetters.push(letter);
    mistakes++;
    drawFunctions[mistakes - 1](); // draw next hangman step
    updateWrongLetters();
  }

  checkGameStatus();
});

letterInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    guessButton.click();
  }
});

resetButton.addEventListener("click", () => {
  fetchWord();
});

// Start game on load
fetchWord();
