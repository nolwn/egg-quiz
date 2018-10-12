const fs = require("fs");
const parseQuestion = require("./quiz-parse.js");

function main() {

  const quizJSON = fs.readFileSync("./egg-questions.json", "utf-8");
  const quizContent = JSON.parse(quizJSON);
  const questionPanel = document.querySelector("#main-form");

  for (let i = 0; i < quizContent.length; i++) {
    console.log(quizContent[i]);
    questionPanel.appendChild(parseQuestion(quizContent[i]));
  }
}

main();
