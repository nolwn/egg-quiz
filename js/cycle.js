module.exports = {
  initialize : initialize,
  nextQuestion : nextQuestion,
  prevQuestion : prevQuestion
}

/*
 *  EXPORTED FUNCTIONS
 */

function nextQuestion(quiz) {
  const nextIndex = advance(quiz);
  const nextHTML = document.getElementById("question-" + nextIndex);

  clearQuestion();
  handleButtons(quiz, nextIndex);
  nextHTML.removeAttribute("hidden");
}

function prevQuestion(quiz) {
  const prevIndex = goBack(quiz);
  const prevHTML = document.getElementById("question-" + prevIndex);

  clearQuestion();
  handleButtons(quiz, current);
  prevIndex.removeAttribute("hidden");
}

function initialize(quiz) {
  const current = getBookmark(quiz);
  const currentHTML = document.getElementById("question-" + current);
  handleButtons(quiz, current);
  currentHTML.removeAttribute("hidden");
}

/*
 *  NON EXPORTED FUNCTIONS
 */

function getBookmark(quiz) {
  for (question in quiz) {
    if (quiz[question].bookmark) {
      return quiz[question].id;
    }
  }
  return 0;
}

function advance(quiz) {
  const current = getBookmark(quiz);
  if (quiz[current]) quiz[current].bookmark = false;
  quiz[current + 1].bookmark = true;

  return current + 1;
}

function goBack(quiz) {
  const current = getBookmark(quiz);
  quiz[current].bookmark = false;
  quiz[current - 1].bookmark = true;
}

function clearQuestion() {
  const questionBlocks = document.getElementsByClassName("question-block");
  let n = 0;

  while (questionBlocks[n]) {
    if (questionBlocks[n].getAttribute("hidden") === null) {
      console.log("found: " + n);
      questionBlocks[n].setAttribute("hidden", "true");
      break;
    }
    n++;
  }
}

function handleButtons(quiz, index) {
  const nextButton = document.querySelector("input[name=\"next\"]");
  const prevButton = document.querySelector("input[name=\"prev\"]");
  const subtButton = document.querySelector("input[type=\"submit\"]");


  if (index === 0) {
    prevButton.setAttribute("disabled", "true");
    subtButton.setAttribute("hidden", "true");
  } else {
    prevButton.removeAttribute("disabled");
    subtButton.setAttribute("hidden", "true");
  }

  if (index === quiz.length - 1) {
    nextButton.setAttribute("hidden", "true");
    subtButton.removeAttribute("hidden");
  } else {
    nextButton.removeAttribute("hidden");
    subtButton.setAttribute("hidden", "true");
  }
}
