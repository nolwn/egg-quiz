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
  const resetButton = document.getElementById("reset");
  let max = 0;
  let finalResult = "Raw Egg";
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
  resultSpan.innerHTML = leadingString + finalResult;
  finalImgPath = "img/" +
    finalResult.split(" ").join("-").toLowerCase() +
    ".jpg";
  finalImg = document.querySelector(`img[src="${finalImgPath}"]`);
  finalImg.removeAttribute("hidden");

  resetButton.addEventListener("click", function() {
    cycle.deleteSave();
    location.assign("index.html");

  });

  console.log(finalImg);
}
