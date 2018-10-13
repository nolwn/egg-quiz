const fs = require("fs");
const parseQuestion = require("./quiz-parse.js");
const cycle = require("./cycle.js");

function main() {
  const quizJSON = fs.readFileSync("./egg-questions.json", "utf-8");
  const quizContent = JSON.parse(quizJSON);
  const questionPanel = document.querySelector("#main-form");
  const nextButton = document.querySelector("input[name=\"next\"]");
  const prevButton = document.querySelector("input[name=\"prev\"]");


  for (let i = 0; i < quizContent.length; i++) {
    // console.log(quizContent[i]);
    questionPanel.insertBefore(parseQuestion(quizContent[i]), prevButton);
  }

  nextButton.addEventListener("click", function() {
    cycle.nextQuestion(quizContent);
  });
  cycle.initialize(quizContent);
}

document.addEventListener("DOMContentLoaded", main);
