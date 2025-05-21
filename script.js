let selectedWord = "";
let guessedLetters = [];
let mistakes = 0;

function startGame() {
  fetchRandomWord();
}

function fetchRandomWord() {
  fetch("https://random-word-api.herokuapp.com/word?number=1")
    .then((response) => response.json())
    .then((data) => {
      selectedWord = data[0].toLowerCase();
      guessedLetters = [];
      mistakes = 0;
      document.getElementById("message").textContent = "";
      displayWord();
      displayAlphabet();
      updateHangman();
    })
    .catch((err) => {
      document.getElementById("message").textContent =
        "⚠️ Failed to load word. Check your internet connection.";
      console.error("Word fetch error:", err);
    });
}

function displayWord() {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = selectedWord
    .split("")
    .map((letter) => (guessedLetters.includes(letter) ? letter : "_"))
    .join(" ");
}

function displayAlphabet() {
  const alphabetContainer = document.getElementById("alphabet-container");
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  alphabetContainer.innerHTML = "";

  for (let letter of alphabet) {
    const btn = document.createElement("div");
    btn.textContent = letter;
    btn.className = "letter";
    btn.onclick = () => guessLetter(letter);
    alphabetContainer.appendChild(btn);
  }
}

function guessLetter(letter) {
  if (guessedLetters.includes(letter)) return;

  guessedLetters.push(letter);

  if (!selectedWord.includes(letter)) {
    mistakes++;
    updateHangman();
  }

  displayWord();
  markLetterGuessed(letter);

  if (checkWin()) {
    document.getElementById("message").textContent = "🎉 You Win!";
    disableAllLetters();
  } else if (mistakes >= 6) {
    document.getElementById(
      "message"
    ).textContent = `💀 You Lost! The word was: ${selectedWord}`;
    disableAllLetters();
  }
}

function markLetterGuessed(letter) {
  const letters = document.querySelectorAll(".letter");
  letters.forEach((btn) => {
    if (btn.textContent === letter) {
      btn.classList.add("guessed");
      btn.onclick = null;
    }
  });
}

function disableAllLetters() {
  const letters = document.querySelectorAll(".letter");
  letters.forEach((btn) => (btn.onclick = null));
}

function updateHangman() {
  const stages = [
    `
     _______
     |     |
     |     
     |    
     |    
     |
    `,
    `
     _______
     |     |
     |     😐
     |    
     |    
     |
    `,
    `
     _______
     |     |
     |     😐
     |     |
     |    
     |
    `,
    `
     _______
     |     |
     |     😐
     |    /|
     |    
     |
    `,
    `
     _______
     |     |
     |     😐
     |    /|\\
     |    
     |
    `,
    `
     _______
     |     |
     |     😟
     |    /|\\
     |    / 
     |
    `,
    `
     _______
     |     |
     |     💀
     |    /|\\
     |    / \\
     |
    `,
  ];

  document.getElementById(
    "hangman"
  ).innerHTML = `<pre>${stages[mistakes]}</pre>`;
}

function checkWin() {
  return selectedWord
    .split("")
    .every((letter) => guessedLetters.includes(letter));
}

// Start the game when the page loads
window.onload = startGame;
