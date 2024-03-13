const word = document.getElementById("word");
const wordContainer = document.getElementById("word-container");
const allwordsContainer = document.getElementById("allwords-container");
const wrong = document.getElementById("wrong-letters");
const playagainbtn = document.getElementById("play-btn");
const popup = document.getElementById("popup-container");
const finalMsg = document.getElementById("final-message");
const allwordsBtn = document.getElementById("allwords");
const addWordBtn = document.getElementById("add-word-btn");
const attempts = 5;

let words = JSON.parse(localStorage.getItem("words")) || [
  "sıber",
  "vatan",
  "yavuzlar",
  "deneme",
  "javascrıpt",
  "react",
  "yetmısdort",
  "emırhan",
  "bılgısayar",
  "yuksekol",
  "baskent",
  "sıfıraltı",
  "zonguldak",
];

let selectWord = words[Math.floor(Math.random() * words.length)];
let correctLetters = [];
let wrongLetters = [];
let allWordsShown = false;

function resetGame() {
  selectWord = words[Math.floor(Math.random() * words.length)];
  correctLetters = [];
  wrongLetters = [];
  displayWord();
  updateWrongLetters();
  popup.style.display = "none";
  hideAllWords();
  allWordsShown = false;
}

function displayWord() {
  word.innerHTML = `
        ${selectWord
          .split("")
          .map(
            (letter) => `
                    <span class="letter">
                        ${correctLetters.includes(letter) ? letter : "*"}
                    </span>
                `
          )
          .join("")}
    `;

  const innerWord = word.innerText.replace(/\n/g, "");

  if (innerWord === selectWord) {
    finalMsg.innerText = "Congratulations! You Won!";
    popup.style.display = "flex";
  }
}

function updateWrongLetters() {
  wrong.innerHTML = `
        ${wrongLetters.length > 0 ? "<p>wrong letters</p>" : ""}
        ${wrongLetters.map((letter) => `<span>${letter}</span>`).join("")}
    `;

  if (wrongLetters.length === attempts) {
    finalMsg.innerText = "You Lost.";
    popup.style.display = "flex";
  }
}

function showAllWords() {
  if (!allWordsShown) {
    allwordsContainer.innerHTML = createWordsTable(words);
    allwordsContainer.style.display = "block";
    wordContainer.style.display = "none";
    addWordBtn.style.display = "inline-block";
    allwordsBtn.innerText = "Close Words";
    allWordsShown = true;
  } else {
    allwordsContainer.style.display = "none";
    wordContainer.style.display = "flex";
    addWordBtn.style.display = "none";
    allwordsBtn.innerText = "All Words";
    allWordsShown = false;
  }
}

function hideAllWords() {
  allwordsContainer.style.display = "none";
  wordContainer.style.display = "flex";
}

function createWordsTable(words) {
  return `
        <table>
            <thead>
                <tr>
                    <th>Word</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                ${words.map(createWordTableRow).join("")}
            </tbody>
        </table>
    `;
}

function createWordTableRow(word) {
  return `
        <tr>
            <td>${word}</td>
            <td><button class="edit-btn" onclick="editWord('${word}')">Edit</button></td>
            <td><button class="delete-btn" onclick="deleteWord('${word}')">Delete</button></td>
        </tr>
    `;
}

function editWord(oldWord) {
  const newWord = prompt(`Edit word "${oldWord}" to:`);
  if (newWord) {
    const index = words.indexOf(oldWord);
    words[index] = newWord;
    showAllWords();
    saveWordsToLocalStorage();
  }
}

function deleteWord(word) {
  const confirmDelete = confirm(`Are you sure you want to delete "${word}"?`);
  if (confirmDelete) {
    const index = words.indexOf(word);
    words.splice(index, 1);
    showAllWords();
    saveWordsToLocalStorage();
  }
}

function saveWordsToLocalStorage() {
  localStorage.setItem("words", JSON.stringify(words));
}

document.addEventListener("click", (e) => {
  if (!e.target.closest("#allwords-container") && e.target.id !== "allwords") {
    hideAllWords();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;

    if (selectWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        alert("You already entered this correct letter!");
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);
        updateWrongLetters();
      } else {
        alert("You have already entered this wrong letter!");
      }
    }
  }
});

playagainbtn.addEventListener("click", resetGame);
allwordsBtn.addEventListener("click", showAllWords);
addWordBtn.addEventListener("click", () => {
  const newWord = prompt("Enter the new word:");
  if (newWord) {
    words.push(newWord);
    saveWordsToLocalStorage();
    resetGame();
  }
});

resetGame();
