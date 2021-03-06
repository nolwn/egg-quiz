const fs = require("fs");
const parseQuestion = require("./quiz-parse.js");
const cycle = require("./cycle.js");

function main() {
  let quizJSON;

  if (localStorage.getItem("savedQuiz")) quizJSON = cycle.loadQuiz();
  else quizJSON = fs.readFileSync("./egg-questions.json", "utf-8");
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
