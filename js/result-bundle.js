(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
  initialize : initialize,
  nextQuestion : nextQuestion,
  prevQuestion : prevQuestion,
  detectAnswer : detectAnswer,
  saveQuiz : saveQuiz,
  loadQuiz : loadQuiz
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
const cycle = require("./cycle.js")

document.addEventListener("DOMContentLoaded", function() {
  result();
});

function result() {
  const questionPanel = document.querySelector("#main-form");
  const quiz = JSON.parse(cycle.loadQuiz());
  const resultSpan = document.getElementById("result");
  const answers = {};
  const leadingVowel = /^[aeiou]/;
  let max = 0;
  let finalResult;
  let leadingString;
  let finalImg;
  let finalImgPath;

  for (let i = 0; i < quiz.length; i++) {
    if (quiz[i].answer !== undefined) {
      console.log(quiz[i].answer);
      const dish = quiz[i].answers[quiz[i].answer].dish;
      if (dish && answers[dish]) {
        answers[dish] += 1;
      } else {
        answers[dish] = 1;
      }
    }
  }

  for (dish in answers) {
    if (answers[dish] > max) {
      max = answers[dish];
      finalResult = dish;
    }
  }

  leadingString = leadingVowel.test(finalResult.toLowerCase()) ? "n " : " ";
  resultSpan.innerText = leadingString + finalResult;
  finalImgPath = "img/" +
    finalResult.split(" ").join("-").toLowerCase() +
    ".jpg";
  finalImg = document.querySelector(`img[src="${finalImgPath}"]`);
  finalImg.removeAttribute("hidden");

  console.log(finalImg);
}

},{"./cycle.js":1}]},{},[2]);
