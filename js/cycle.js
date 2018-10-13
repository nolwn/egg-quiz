module.exports = nextQuestion;

function cycle(quiz) {

}

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
  console.log(current + 1);
  // console.log(quiz[current + 1]);
  quiz[current + 1].bookmark = true;
  console.log(quiz[current + 1]);

  return current + 1;
}

function clearQuestion() {
  console.log("clear");
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

function nextQuestion(quiz) {
  const nextIndex = advance(quiz);
  // console.log(nextIndex);
  const nextHTML = document.getElementById("question-" + nextIndex);

  clearQuestion();
  nextHTML.removeAttribute("hidden");
}
