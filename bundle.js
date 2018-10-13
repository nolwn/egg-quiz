(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){

const parseQuestion = require("./quiz-parse.js");
const nextQuestion = require("./cycle.js");

function main() {
  const quizJSON = "[\n  {\n    \"id\" : 0,\n    \"type\" : \"multi-choice\",\n    \"question\" : \"Which skill would you rather have a mastery of?\",\n    \"answers\" : [\n      {\n        \"text\" : \"Running\",\n        \"dish\" : \"Hard Boiled Egg\"\n      },\n      {\n        \"text\" : \"High wire walking\",\n        \"dish\" : \"Deviled Egg\"\n      },\n      {\n        \"text\" : \"Gourmet cooking\",\n        \"dish\" : \"French Omlette\"\n      },\n      {\n        \"text\" : \"Speed chugging a beer\",\n        \"dish\" : \"Pickled Egg\"\n      },\n      {\n        \"text\" : \"I already know everything I want to know\",\n        \"dish\" : \"Hard Boiled Egg\"\n      },\n      {\n        \"text\" : \"I don't know\",\n        \"dish\" : \"Egg Salad\"\n      }\n    ]\n  },\n  {\n    \"id\" : 1,\n    \"type\" : \"multi-choice\",\n    \"question\" : \"When are you most productive?\",\n    \"answers\" : [\n      {\n        \"text\" : \"In the morning\",\n        \"dish\" : \"French Omlette\"\n      },\n      {\n        \"text\" : \"In the afternoon\",\n        \"dish\" : \"Fried Egg\"\n      },\n      {\n        \"text\" : \"In the evening\",\n        \"dish\" : \"Pickled Egg\"\n      },\n      {\n        \"text\" : \"I'm never productive\",\n        \"dish\" : \"Scrambled Egg\"\n      }\n    ]\n  },\n  {\n    \"id\" : 2,\n    \"type\" : \"multi-choice\",\n    \"question\" : \"What is your primary vice?\",\n    \"answers\" : [\n      {\n        \"text\" : \"I'm a drinker\",\n        \"dish\" : \"Pickled Egg\"\n      },\n      {\n        \"text\" : \"I'm a gambler\",\n        \"dish\" : \"Deviled Egg\"\n      },\n      {\n        \"text\" : \"I'm a smoker\",\n        \"dish\" : \"French Omlette\"\n      },\n      {\n        \"text\" : \"I'm a stoner\",\n        \"dish\" : \"Fried Egg\"\n      },\n      {\n        \"text\" : \"I haven no vice\",\n        \"dish\" : \"Poached Egg\"\n      },\n      {\n        \"text\" : \"I can't decide what my biggest vice is\",\n        \"dish\" : \"Egg Salad\"\n      }\n    ]\n  },\n  {\n    \"id\" : 3,\n    \"type\" : \"multi-choice\",\n    \"question\" : \"What is your primary vice?\",\n    \"answers\" : [\n      {\n        \"text\" : \"I'm a drinker\",\n        \"dish\" : \"Pickled Egg\"\n      },\n      {\n        \"text\" : \"I'm a gambler\",\n        \"dish\" : \"Deviled Egg\"\n      },\n      {\n        \"text\" : \"I'm a smoker\",\n        \"dish\" : \"French Omlette\"\n      },\n      {\n        \"text\" : \"I'm a stoner\",\n        \"dish\" : \"Fried Egg\"\n      },\n      {\n        \"text\" : \"I haven no vice\",\n        \"dish\" : \"Poached Egg\"\n      },\n      {\n        \"text\" : \"I can't decide what my biggest vice is\",\n        \"dish\" : \"Egg Salad\"\n      }\n    ]\n  }\n]\n";
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

  // console.log(questionHTML);

  return questionHTML;
}

function multiChoice(answers, n, answer = -1) {
  console.log(answer);
  const container = document.createElement("div");

  for (let i = 0; i < answers.length; i++) {
    const choice = answers[i];

    let inputHTML = document.createElement("input");
    let labelHTML = document.createElement("label");
    let labelText = document.createElement("span");

    inputHTML.setAttribute("type", "radio");
    inputHTML.setAttribute("name", "question-" + n);
    inputHTML.setAttribute("value", choice.dish);
    if (answer > 0 && answer === i)
      inputHTML.setAttribute("checked", "true");

    labelText.innerText = choice.text;

    labelHTML.appendChild(inputHTML);
    labelHTML.appendChild(labelText);

    container.appendChild(labelHTML);
    container.appendChild(document.createElement("br"));
  }

  return container;
}

},{}]},{},[2]);
