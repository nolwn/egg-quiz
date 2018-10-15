(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
  initialize : initialize,
  nextQuestion : nextQuestion,
  prevQuestion : prevQuestion,
  detectAnswer : detectAnswer,
  saveQuiz : saveQuiz,
  loadQuiz : loadQuiz,
  deleteSave : deleteSave
}

/*
 *  EXPORTED FUNCTIONS
 */

 function initialize(quiz) {
   const current = getBookmark(quiz);
   const currentHTML = document.getElementById("question-" + current);
   handleButtons(quiz, current);
   paginate(quiz);
   currentHTML.removeAttribute("hidden");
 }

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

  detectAnswer(quiz, prevIndex + 1);
  clearQuestion();
  handleButtons(quiz, prevIndex);
  paginate(quiz);
  saveQuiz(quiz);
  prevHTML.removeAttribute("hidden");
}

function detectAnswer(quiz, index) {
  const questionHTML = document.getElementById("question-" + index);
  const question = quiz[index];
  const input = questionHTML.querySelector("input:checked");

  if (input) question.answer = input.value;
  console.log(input);
  console.log(index);
  console.log(question);
  console.log(questionHTML);

  return !!input;
}

function saveQuiz(quiz) {
  localStorage.setItem("savedQuiz", JSON.stringify(quiz));
}

function loadQuiz() {
  const save = localStorage.getItem("savedQuiz");
  if (save) return localStorage.getItem("savedQuiz");
  else return null;
}

function deleteSave() {
  localStorage.removeItem("savedQuiz");
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

},{}],2:[function(require,module,exports){

const parseQuestion = require("./quiz-parse.js");
const cycle = require("./cycle.js");

function main() {
  let quizJSON;

  if (localStorage.getItem("savedQuiz")) quizJSON = cycle.loadQuiz();
  else quizJSON = "[\n  {\n    \"id\" : 0,\n    \"type\" : \"multi-choice\",\n    \"question\" : \"Which skill would you rather have a mastery of?\",\n    \"answers\" : [\n      {\n        \"text\" : \"Running\",\n        \"dish\" : \"Hard Boiled Egg\"\n      },\n      {\n        \"text\" : \"High wire walking\",\n        \"dish\" : \"Deviled Egg\"\n      },\n      {\n        \"text\" : \"Gourmet cooking\",\n        \"dish\" : \"French Omelette\"\n      },\n      {\n        \"text\" : \"Speed chugging a beer\",\n        \"dish\" : \"Pickled Egg\"\n      },\n      {\n        \"text\" : \"I already know everything I want to know\",\n        \"dish\" : \"Hard Boiled Egg\"\n      },\n      {\n        \"text\" : \"I don't know\",\n        \"dish\" : \"Egg Salad\"\n      }\n    ]\n  },\n  {\n    \"id\" : 1,\n    \"type\" : \"multi-choice\",\n    \"question\" : \"When are you most productive?\",\n    \"answers\" : [\n      {\n        \"text\" : \"In the morning\",\n        \"dish\" : \"French Omelette\"\n      },\n      {\n        \"text\" : \"In the afternoon\",\n        \"dish\" : \"Fried Egg\"\n      },\n      {\n        \"text\" : \"In the evening\",\n        \"dish\" : \"Pickled Egg\"\n      },\n      {\n        \"text\" : \"I'm never productive\",\n        \"dish\" : \"Scrambled Egg\"\n      }\n    ]\n  },\n  {\n    \"id\" : 2,\n    \"type\" : \"multi-choice\",\n    \"question\" : \"What is your primary vice?\",\n    \"answers\" : [\n      {\n        \"text\" : \"I'm a drinker\",\n        \"dish\" : \"Pickled Egg\"\n      },\n      {\n        \"text\" : \"I'm a gambler\",\n        \"dish\" : \"Deviled Egg\"\n      },\n      {\n        \"text\" : \"I'm a smoker\",\n        \"dish\" : \"French Omelette\"\n      },\n      {\n        \"text\" : \"I'm a stoner\",\n        \"dish\" : \"Fried Egg\"\n      },\n      {\n        \"text\" : \"I haven no vice\",\n        \"dish\" : \"Poached Egg\"\n      },\n      {\n        \"text\" : \"I can't decide what my biggest vice is\",\n        \"dish\" : \"Egg Salad\"\n      }\n    ]\n  }\n]\n";
  const quizContent = JSON.parse(quizJSON);
  const questionPanel = document.querySelector("#main-form");
  const nextButton = document.querySelector("input[name=\"next\"]");
  const prevButton = document.querySelector("input[name=\"prev\"]");
  const subtButton = document.querySelector("input[type=\"submit\"]");
  const rsetButton = document.getElementById("reset");
  const result = "result.html";

  for (let i = 0; i < quizContent.length; i++) {
    questionPanel.insertBefore(parseQuestion(quizContent[i]), prevButton);
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
    window.location.href = result;
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
      // console.log(question);
      if (question.answer === undefined)
        questionHTML.appendChild(multiChoice(question.answers, question.id));
      else
        questionHTML.appendChild(
          multiChoice(question.answers, question.id, question.answer)
        );
      break;
    default:
      console.log("Quesion is of an unknown type.");
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

    console.log("index: " + i);
    console.log("stored answer: " + answer);

    if (answer > -1 && answer == i) { // note the `==` for coercion
      console.log("match");
      inputHTML.setAttribute("checked", "true");
    } else {

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
