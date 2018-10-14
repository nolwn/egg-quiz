module.exports = {
  initialize : initialize,
  nextQuestion : nextQuestion,
  prevQuestion : prevQuestion,
  saveQuiz : saveQuiz,
  loadQuiz : loadQuiz
}

/*
 *  EXPORTED FUNCTIONS
 */

function nextQuestion(quiz) {
  const nextIndex = advance(quiz);
  const nextHTML = document.getElementById("question-" + nextIndex);

  detectAnswer(quiz, nextIndex - 1);
  clearQuestion();
  handleButtons(quiz, nextIndex);
  paginate(quiz);
  saveQuiz(quiz);
  nextHTML.removeAttribute("hidden");
}

function prevQuestion(quiz) {
  const prevIndex = goBack(quiz);
  const prevHTML = document.getElementById("question-" + prevIndex);

  clearQuestion();
  handleButtons(quiz, prevIndex);
  paginate(quiz);
  saveQuiz(quiz);
  prevHTML.removeAttribute("hidden");
}

function initialize(quiz) {
  const current = getBookmark(quiz);
  const currentHTML = document.getElementById("question-" + current);
  handleButtons(quiz, current);
  paginate(quiz);
  currentHTML.removeAttribute("hidden");
}

function saveQuiz(quiz) {
  localStorage.setItem("savedQuiz", JSON.stringify(quiz));
}

function loadQuiz() {
  const save = localStorage.getItem("savedQuiz");
  if (save) return localStorage.getItem("savedQuiz");
  else return null;
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

  return current - 1;
}

function detectAnswer(quiz, index) {
  const questionHTML = document.getElementById("question-" + index);
  const question = quiz[index];
  const input = questionHTML.querySelector("input:checked");

  if (input) question.answer = input.value;

  return !!input;
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

function paginate(quiz) {
  const pages = document.createElement("div");
  const oldPages = document.getElementById("pagination");
  const nextButton = document.querySelector("input[name=\"next\"]");
  const mainForm = document.getElementById("main-form");

  if (oldPages) mainForm.removeChild(oldPages);

  pages.id = "pagination";

  // Just to prove that I can use these Array functions!
  quiz.forEach(function(el, i) {
    let page = document.createElement("span");

    page.classList.add("page-marker");
    if (el.answer) {
      page.classList.add("teal");
      page.classList.add("lighten-1");
      page.innerText = "✔︎";
    } else {
      page.innerText = i + 1;
    }
    pages.appendChild(page);
    mainForm.insertBefore(pages, nextButton);
  });

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
