const fs = require("fs");
const parseQuestion = require("./quiz-parse.js");
const cycle = require("./cycle.js");

function main() {
  let quizJSON;

  if (localStorage.getItem("savedQuiz")) quizJSON = cycle.loadQuiz();
  else quizJSON = fs.readFileSync("./egg-questions.json", "utf-8");
  const quizContent = JSON.parse(quizJSON);
  const questionPanel = document.querySelector("#main-form");
  const nextButton = document.querySelector("input[name=\"next\"]");
  const prevButton = document.querySelector("input[name=\"prev\"]");
  const subtButton = document.querySelector("input[type=\"submit\"]");
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

  cycle.initialize(quizContent);
}

document.addEventListener("DOMContentLoaded", main);
