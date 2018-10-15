(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
  initialize : initialize,
  nextQuestion : nextQuestion,
  prevQuestion : prevQuestion,
  detectAnswer : detectAnswer,
  validate : validate,
  saveQuiz : saveQuiz,
  loadQuiz : loadQuiz,
  deleteSave : deleteSave
}

/*
*  A note about `quiz`: `quiz` is the object that is initially created from
*  out JSON file. It represents that state of the quiz. It is passed to most of
*  these functions to avoid making it a global variable.
*/

/*
 *  EXPORTED FUNCTIONS
 */

/*
 *  Parameters: Array quiz
 *  Return:     void
 *
 *  Sets up a quiz based on a given state and puts the user into either a
 *  bookmarked question, or the first question if one has not been bookmarked.
 */
function initialize(quiz) {
 const current = getBookmark(quiz);
 const currentHTML = document.getElementById("question-" + current);
 handleButtons(quiz, current);
 paginate(quiz);
 currentHTML.removeAttribute("hidden");
}

/*
 *  Parameters: Array quiz
 *  Return:     void
 *
 *  Handles the click event on the "next" button. Coordiantes hiding the current
 *  question and showing the next one.
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

/*
 *  Parameters: Array quiz
 *  Return:     void
 *
 *  Handles the click even on the "prev" button. Coordinates hiding the current
 *  question and showing the prevoius one.
 */
function prevQuestion(quiz) {
  const prevIndex = goBack(quiz);
  const prevHTML = document.getElementById("question-" + prevIndex);

  detectAnswer(quiz, prevIndex + 1);
  clearQuestion();
  handleButtons(quiz, prevIndex);
  paginate(quiz);
  saveQuiz(quiz);
  prevHTML.removeAttribute("hidden");
}

/*
 *  Parameters: Array quiz,
                Integer index represents an index within quiz, i.e., a question
                object
 *  Return:     a boolean which is true if an input was detected
 *
 *  Checks the HTML representation of a quiz question to see if it has been
 *  ansered by looking for a checked input. May be specific to multi-choice
 *  question type if more types were added.
 */
function detectAnswer(quiz, index) {
  const questionHTML = document.getElementById("question-" + index);
  const question = quiz[index];
  const input = questionHTML.querySelector("input:checked");

  if (input) question.answer = input.value;

  return !!input;
}

/*
 *  Parameters: Array quiz
 *  Return:     an object representing the number of questions ansered and the
 *              total number of questions asked.
 *
 *  Gets the length of the quiz and loops over the questions to detect how many
 *  have been answered and returns those pieces of data in an Object.
 */
function validate(quiz) {
  const total = quiz.length;
  let answered = 0;
  for (let i = 0; i < total; i++) {
    if (detectAnswer(quiz, i)) answered++;
  }

  return {answered : answered, total : total};
}

/*
 *  Parameters: Array quiz
 *  Return:     void
 *
 *  Saves the quiz state as a JSON formatted String in localStorage.
 */
function saveQuiz(quiz) {
  localStorage.setItem("savedQuiz", JSON.stringify(quiz));
}

/*
 *  Parameters: Array quiz
 *  Return:     a JSON formatted String which represents a quiz state saved in
 *              localStorage.
 *
 *  Looks for a saved quiz in local storage and returns it. Returns null if none
 *  is found.
 */
function loadQuiz() {
  const save = localStorage.getItem("savedQuiz");
  if (save) return localStorage.getItem("savedQuiz");
  else return null;
}

/*
 *  Parameters: none
 *  Return:     none
 *
 *  Clears saved quiz from localStorage.
 */
function deleteSave() {
  localStorage.removeItem("savedQuiz");
}

/*
 *  NON EXPORTED FUNCTIONS
 */

/*
 *  Parameters: Array quiz
 *  Return:     Integer representing the id a question
 *
 *  Loops over the quiz and looks for a bookmark property. Retruns the id of the
 *  first (which should be the only) question if finds with a `true` bookmark.
 *  Returns 0 (the first question) if no bookmark is found.
 */
function getBookmark(quiz) {
  for (question in quiz) {
    if (quiz[question].bookmark) {
      return quiz[question].id;
    }
  }
  return 0;
}

/*
 *  Parameters: Array quiz
 *  Return:     Integer representing a question index
 *
 *  Gets the current bookmark and moves it to the next question. Returns the id
 *  of the new bookmarked quiz item.
 */
function advance(quiz) {
  const current = getBookmark(quiz);
  if (quiz[current]) quiz[current].bookmark = false;
  quiz[current + 1].bookmark = true;

  return current + 1;
}

/*
 *  Parameters: Array quiz
 *  Return:     Integer representing a question index
 *
 *  Gets the current bookmark and moves it to the previous question. Returns the
 *  id of the new bookmarked quiz item.
 */
function goBack(quiz) {
  const current = getBookmark(quiz);
  quiz[current].bookmark = false;
  quiz[current - 1].bookmark = true;

  return current - 1;
}

/*
 *  Parameters: None
 *  Return:     None
 *
 *  Loops through question blocks in the DOM, finds the one that is not hidden
 *  and hides it.
 */
function clearQuestion() {
  const questionBlocks = document.getElementsByClassName("question-block");
  let n = 0;

  while (questionBlocks[n]) {
    if (questionBlocks[n].getAttribute("hidden") === null) {
      // console.log("found: " + n);
      questionBlocks[n].setAttribute("hidden", "true");
      break;
    }
    n++;
  }
}

/*
 *  Parameters: Array quiz
 *  Return:     None
 *
 *  Builds the pagination at the bottom of the quiz. Perhaps not technically
 *  pagination since it's all one page, but should seem like it is to the user.
 */
function paginate(quiz) {
  const pages = document.createElement("div"); // will be the new pagination

  // pagination that's already there
  const oldPages = document.getElementById("pagination");
  const nextButton = document.querySelector("input[name=\"next\"]");
  const pageButtons = document.getElementById("page-buttons");

  if (oldPages) pageButtons.removeChild(oldPages); // Delete the old pagination

  pages.id = "pagination";

  // Just to prove that I can use these Array functions!
  // Loops over quiz and generates spans for the page markers
  quiz.forEach(function(el, i) {
    let page = document.createElement("span");
    page.classList.add("page-marker");

    // If the question has an answer
    if (el.answer) {
      page.classList.add("teal");
      page.classList.add("lighten-1");
      page.innerText = "✔︎";
    } else {
      page.innerText = i + 1;
    }
    pages.appendChild(page);
    pageButtons.insertBefore(pages, nextButton);
  });

}

/*
 *  Parameters: Array quiz,
 *              Integer index
 *  Return:     void
 *
 *  Hides/Shows buttons depending on where the user is in the quiz.
 */
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

},{}],2:[function(require,module,exports){

const parseQuestion = require("./quiz-parse.js");
const cycle = require("./cycle.js");

function main() {
  let quizJSON;

  if (localStorage.getItem("savedQuiz")) quizJSON = cycle.loadQuiz();
  else quizJSON = "[\n  {\n    \"id\" : 0,\n    \"type\" : \"multi-choice\",\n    \"question\" : \"Which skill would you rather have a mastery of?\",\n    \"answers\" : [\n      {\n        \"text\" : \"Running\",\n        \"dish\" : \"Hard Boiled Egg\"\n      },\n      {\n        \"text\" : \"High wire walking\",\n        \"dish\" : \"Deviled Egg\"\n      },\n      {\n        \"text\" : \"Gourmet cooking\",\n        \"dish\" : \"French Omelette\"\n      },\n      {\n        \"text\" : \"Speed chugging a beer\",\n        \"dish\" : \"Pickled Egg\"\n      },\n      {\n        \"text\" : \"I already know everything I want to know\",\n        \"dish\" : \"Hard Boiled Egg\"\n      },\n      {\n        \"text\" : \"I don't know\",\n        \"dish\" : \"Egg Salad\"\n      }\n    ]\n  },\n  {\n    \"id\" : 1,\n    \"type\" : \"multi-choice\",\n    \"question\" : \"When are you most productive?\",\n    \"answers\" : [\n      {\n        \"text\" : \"In the morning\",\n        \"dish\" : \"French Omelette\"\n      },\n      {\n        \"text\" : \"In the afternoon\",\n        \"dish\" : \"Fried Egg\"\n      },\n      {\n        \"text\" : \"In the evening\",\n        \"dish\" : \"Pickled Egg\"\n      },\n      {\n        \"text\" : \"I'm never productive\",\n        \"dish\" : \"Scrambled Egg\"\n      }\n    ]\n  },\n  {\n    \"id\" : 2,\n    \"type\" : \"multi-choice\",\n    \"question\" : \"What is your primary vice?\",\n    \"answers\" : [\n      {\n        \"text\" : \"I'm a drinker\",\n        \"dish\" : \"Pickled Egg\"\n      },\n      {\n        \"text\" : \"I'm a gambler\",\n        \"dish\" : \"Deviled Egg\"\n      },\n      {\n        \"text\" : \"I'm a smoker\",\n        \"dish\" : \"French Omelette\"\n      },\n      {\n        \"text\" : \"I'm a stoner\",\n        \"dish\" : \"Fried Egg\"\n      },\n      {\n        \"text\" : \"I haven no vice\",\n        \"dish\" : \"Poached Egg\"\n      },\n      {\n        \"text\" : \"I can't decide what my biggest vice is\",\n        \"dish\" : \"Egg Salad\"\n      }\n    ]\n  },\n  {\n    \"id\" : 3,\n    \"type\" : \"multi-choice\",\n    \"question\" : \"What would you rather do on a Satruday night?\",\n    \"answers\" : [\n      {\n        \"text\" : \"At a bit party\",\n        \"dish\" : \"Scrambled Egg\"\n      },\n      {\n        \"text\" : \"Planning a bank heist\",\n        \"dish\" : \"Deviled Egg\"\n      },\n      {\n        \"text\" : \"Smoking cigarettes outside of a cafe\",\n        \"dish\" : \"French Omelette\"\n      },\n      {\n        \"text\" : \"Sitting on a bar stool\",\n        \"dish\" : \"Pickled Egg\"\n      }\n    ]\n  },\n  {\n    \"id\" : 4,\n    \"type\" : \"multi-choice\",\n    \"question\" : \"A fight is breaking out, what weapon do you have on hand?\",\n    \"answers\" : [\n      {\n        \"text\" : \"A pool cue\",\n        \"dish\" : \"Pickled Egg\"\n      },\n      {\n        \"text\" : \"A cooking knife\",\n        \"dish\" : \"French Omelette\"\n      },\n      {\n        \"text\" : \"A poisoinous syringe\",\n        \"dish\" : \"Deviled Egg\"\n      },\n      {\n        \"text\" : \"My fists\",\n        \"dish\" : \"Hard Boiled Egg\"\n      },\n      {\n        \"text\" : \"I do not fight\",\n        \"dish\" : \"Egg Salad\"\n      }\n    ]\n  }\n]\n";
  const quizContent = JSON.parse(quizJSON);
  const pageButtons = document.querySelector("#page-buttons");
  const mainForm = document.querySelector("#main-form");
  const nextButton = document.querySelector("input[name=\"next\"]");
  const prevButton = document.querySelector("input[name=\"prev\"]");
  const subtButton = document.querySelector("input[type=\"submit\"]");
  const rsetButton = document.getElementById("reset");
  const result = "result.html";

  for (let i = 0; i < quizContent.length; i++) {
    mainForm.insertBefore(parseQuestion(quizContent[i]), pageButtons);
  }

  nextButton.addEventListener("click", function() {
    cycle.nextQuestion(quizContent);
  });

  prevButton.addEventListener("click", function() {
    cycle.prevQuestion(quizContent);
  });

  subtButton.addEventListener("click", function(e) {
    e.preventDefault();
    cycle.detectAnswer(quizContent, quizContent.length - 1);
    cycle.saveQuiz(quizContent);
    const completed = cycle.validate(quizContent);
    if (completed.total - completed.answered > 2)
      alert ("Can only skip up to 2 questions. Please go back and answer some more.");
    else window.location.href = result;
  });

  rsetButton.addEventListener("click", function() {
    cycle.deleteSave();
    window.location.reload(true);
  });

  cycle.initialize(quizContent);
}

document.addEventListener("DOMContentLoaded", main);

},{"./cycle.js":1,"./quiz-parse.js":3}],3:[function(require,module,exports){
module.exports = parseQuestion;

function parseQuestion(question) {
  const questionHTML = document.createElement("div");
  const questionTitle = document.createElement("h2");

  questionTitle.innerText = question.question;
  questionTitle.classList.add("center-align");

  questionHTML.id = "question-" + question.id;
  questionHTML.classList.add("question-block");
  questionHTML.setAttribute("hidden", "true");
  if (!!question.bookmark) questionHTML.setAttribute("bookmark", "true");
  questionHTML.appendChild(questionTitle);

  switch(question.type) {
    case "multi-choice":
      if (question.answer === undefined)
        questionHTML.appendChild(multiChoice(question.answers, question.id));
      else
        questionHTML.appendChild(
          multiChoice(question.answers, question.id, question.answer)
        );
      break;
    default:
      return null;
  }

  // console.log(question);

  return questionHTML;
}

function multiChoice(answers, n, answer = -1) {
  // console.log(answer);
  const container = document.createElement("div");
  container.classList.add("inputs");

  for (let i = 0; i < answers.length; i++) {
    const choice = answers[i];

    let inputHTML = document.createElement("input");
    let labelHTML = document.createElement("label");
    let labelText = document.createElement("span");

    inputHTML.setAttribute("type", "radio");
    inputHTML.setAttribute("name", "question-" + n);
    inputHTML.setAttribute("value", i);

    if (answer > -1 && answer == i) { // `==` for coercion
      inputHTML.setAttribute("checked", "true");
    }

    labelText.innerText = choice.text;

    labelHTML.appendChild(inputHTML);
    labelHTML.appendChild(labelText);

    container.appendChild(labelHTML);
    container.appendChild(document.createElement("br"));
  }

  return container;
}

},{}]},{},[2]);
