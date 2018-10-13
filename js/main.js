const fs = require("fs");
const parseQuestion = require("./quiz-parse.js");
const nextQuestion = require("./cycle.js");

function main() {
  const quizJSON = fs.readFileSync("./egg-questions.json", "utf-8");
  const quizContent = JSON.parse(quizJSON);
  const questionPanel = document.querySelector("#main-form");
  const nextButton = document.querySelector("input[name=\"next\"]");

  for (let i = 0; i < quizContent.length; i++) {
    // console.log(quizContent[i]);
    questionPanel.appendChild(parseQuestion(quizContent[i]));
  }

  nextButton.addEventListener("click", function() {
    nextQuestion(quizContent);
  });
}

main();
