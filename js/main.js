let GameName = "The Gusess Game";

document.title = GameName;
document.querySelector("h1").innerHTML = GameName;
document.querySelector("footer").innerHTML = `${GameName} &copy Mostafa ❤️🔥`;

// configs
let config = {
  numbersOfTries: 5,
  numbersOfLetters: 6,
  currentTry: 1,
  hint: 3,
  wordToGuess: "",
};
//  Words
const words = [
  "Create",
  "Update",
  "Delete",
  "Master",
  "Branch",
  "Mainly",
  "Elzero",
  "School",
];
// Set Random Word
config.wordToGuess =
  words[Math.floor(Math.random() * words.length)].toLowerCase();

// Testing Good
// document.getElementById("test").addEventListener("click", function () {
//   NextTry();
// });

const checkButton = document.getElementById("check_button");
const hintButton = document.querySelector(".hint");

checkButton.addEventListener("click", checkWord);
hintButton.addEventListener("click", hint);

window.onload = function () {
  Generate_Inputs();
  hintButton.children[0].innerHTML = `(${config.hint}) `;
};

console.log(config.wordToGuess);

//Functions
function Generate_Inputs() {
  const inputsContainer = document.querySelector(".inputs");

  for (let try_number = 1; try_number <= config.numbersOfTries; try_number++) {
    let tryDiv = CreatTryDiv(try_number);
    //Create inputs For Each Try
    for (let letterNum = 1; letterNum <= config.numbersOfLetters; letterNum++) {
      let input = Createinput(try_number, letterNum);
      tryDiv.appendChild(input);
    }

    inputsContainer.appendChild(tryDiv);
  }

  inputsContainer.children[0].children[1].focus();

  // Disable all inputs that not in current try
  const DisabledInputs = document.querySelectorAll(".disabled-input input");
  DisabledInputs.forEach((input) => (input.disabled = true));

  const allInputs = document.querySelectorAll("input");

  allInputs.forEach((input, index) => {
    const nextInput = allInputs[index + 1];
    const prevInput = allInputs[index - 1];

    // Event listener for input event to move to the next input
    input.addEventListener("input", function () {
      // Convert input value to lowercase
      this.value = this.value.toLowerCase();
      // Move focus to the next input
      if (nextInput) nextInput.focus();
    });

    // Event listener for keydown event to handle arrow keys and backspace
    input.addEventListener("keydown", function (e) {
      switch (e.key) {
        case "ArrowRight":
          // Move focus to the next input
          if (nextInput) nextInput.focus();
          break;
        case "ArrowLeft":
          // Move focus to the previous input
          if (prevInput) prevInput.focus();
          break;
        case "Backspace":
          // Prevent default behavior of backspace key
          e.preventDefault();
          // Clear the current input value
          this.value = "";
          // Move focus to the previous input
          if (prevInput) prevInput.focus();
          break;
      }
    });
  });
}
function checkWord() {
  const wordToGuess = Array.from(config.wordToGuess);
  let success = true;
  // Object to track guessed letters to avoid duplicate markings
  let guessedLetters = "";

  for (let fieldNum = 1; fieldNum <= config.numbersOfLetters; fieldNum++) {
    // Get the input field by its ID
    const inputField = document.getElementById(
      `gusess-${config.currentTry}-letter-${fieldNum}`
    );
    const guessedLetter = inputField.value;
    const actualLetter = wordToGuess[fieldNum - 1];

    if (guessedLetter === actualLetter) {
      inputField.classList.add("in-place");
      guessedLetters += guessedLetter;
    } else {
      if (
        wordToGuess.includes(guessedLetter) &&
        !guessedLetters.includes(guessedLetter)
      ) {
        inputField.classList.add("not-in-place");
        guessedLetters += guessedLetter;
      } else {
        inputField.classList.add("no");
      }
      success = false; // Update success flag if any letter is incorrect
    }
  }

  // If the word is not successfully guessed, trigger the NextTry function
  if (!success) {
    if (!NextTry()) lose();
  } else {
    win();
  }
}
function NextTry() {
  const currentTryDiv = document.querySelector(`.try-${config.currentTry}`);
  const currentTryInputs = currentTryDiv.querySelectorAll("input");

  disableInputs(currentTryDiv, currentTryInputs);

  if (config.currentTry < config.numbersOfTries) {
    config.currentTry++;
    const nextTryDiv = document.querySelector(`.try-${config.currentTry}`);
    const nextTryInputs = nextTryDiv.querySelectorAll("input");
    enableInputs(nextTryDiv, nextTryInputs);
    nextTryDiv.children[1].focus();
    return true;
  }
  return false;
}

function disableInputs(div, inputs) {
  div.classList.add("disabled-input");
  inputs.forEach((input) => {
    input.disabled = true;
  });
}

function disableCheckButton() {
  const checkButton = document.getElementById("check_button");

  checkButton.disabled = true;
  checkButton.classList.add("disable_button");
}

function enableInputs(div, inputs) {
  div.classList.remove("disabled-input");
  inputs.forEach((input) => {
    input.disabled = false;
  });
}

function CreatTryDiv(id) {
  // Create a <div> element for each try
  let tryDiv = document.createElement("div");
  tryDiv.classList.add(`try-${id}`);
  tryDiv.innerHTML = `<span>Try-${id}</span>`;
  if (id !== 1) tryDiv.classList.add("disabled-input");

  return tryDiv;
}
function Createinput(id, letterNum) {
  let input = document.createElement("input");
  input.type = "text";
  input.setAttribute("maxlength", "1");
  /* 
    Creat Try Dive With Name gusess-${try_number}-letter-${letter_number}
    to make access in handle work more easy
  */
  input.setAttribute("id", `gusess-${id}-letter-${letterNum}`);
  return input;
}
function win() {
  const message = document.querySelector(".message");
  message.innerHTML = `Great The word is <span>${config.wordToGuess}</span>`;
  disableCheckButton();
}

function lose() {
  const message = document.querySelector(".message");
  message.innerHTML = `Ops there is no try any More`;
  disableCheckButton();
}

function hint() {
  if (config.hint > 0) {
    // const randomCharacter =
    //   config.wordToGuess[
    //     Math.floor(Math.random() * config.wordToGuess.length)
    //   ].toLowerCase();

    // Add Random To input

    for (
      let emptyInput = 1;
      emptyInput <= config.numbersOfLetters;
      emptyInput++
    ) {
      let input = document.getElementById(
        `gusess-${config.currentTry}-letter-${emptyInput}`
      );

      if (input.value === "") {
        input.value = config.wordToGuess[emptyInput - 1];
        config.hint--;
        hintButton.children[0].innerHTML = `(${config.hint}) `;
        break;
      }
    }
  }
}
