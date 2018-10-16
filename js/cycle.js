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
  quiz[0].bookmark = true;
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
      if (el.bookmark) page.classList.add("active-page");
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
