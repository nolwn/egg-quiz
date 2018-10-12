(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

const parseQuestion = require("./quiz-parse.js");

function main() {

  const quizJSON = "[\n  {\n    \"id\" : 0,\n    \"type\" : \"multi-choice\",\n    \"question\" : \"Which skill would you rather have a mastery of?\",\n    \"answers\" : [\n      {\n        \"text\" : \"Running\",\n        \"dish\" : \"Hard Boiled Egg\"\n      },\n      {\n        \"text\" : \"High wire walking\",\n        \"dish\" : \"Deviled Egg\"\n      },\n      {\n        \"text\" : \"Gourmet cooking\",\n        \"dish\" : \"French Omlette\"\n      },\n      {\n        \"text\" : \"Speed chugging a beer\",\n        \"dish\" : \"Pickled Egg\"\n      },\n      {\n        \"text\" : \"I already know everything I want to know\",\n        \"dish\" : \"Hard Boiled Egg\"\n      },\n      {\n        \"text\" : \"I don't know\",\n        \"dish\" : \"Egg Salad\"\n      }\n    ]\n  },\n  {\n    \"id\" : 1,\n    \"type\" : \"multi-choice\",\n    \"question\" : \"When are you most productive?\",\n    \"answers\" : [\n      {\n        \"text\" : \"In the morning\",\n        \"dish\" : \"French Omlette\"\n      },\n      {\n        \"text\" : \"In the afternoon\",\n        \"dish\" : \"Fried Egg\"\n      },\n      {\n        \"text\" : \"In the evening\",\n        \"dish\" : \"Pickled Egg\"\n      },\n      {\n        \"text\" : \"I'm never productive\",\n        \"dish\" : \"Scrambled Egg\"\n      }\n    ]\n  },\n  {\n    \"id\" : 2,\n    \"type\" : \"multi-choice\",\n    \"question\" : \"What is your primary vice?\",\n    \"answers\" : [\n      {\n        \"text\" : \"I'm a drinker\",\n        \"dish\" : \"Pickled Egg\"\n      },\n      {\n        \"text\" : \"I'm a gambler\",\n        \"dish\" : \"Deviled Egg\"\n      },\n      {\n        \"text\" : \"I'm a smoker\",\n        \"dish\" : \"French Omlette\"\n      },\n      {\n        \"text\" : \"I'm a stoner\",\n        \"dish\" : \"Fried Egg\"\n      },\n      {\n        \"text\" : \"I haven no vice\",\n        \"dish\" : \"Poached Egg\"\n      },\n      {\n        \"text\" : \"I can't decide what my biggest vice is\",\n        \"dish\" : \"Egg Salad\"\n      }\n    ]\n  }\n]\n";
  const quizContent = JSON.parse(quizJSON);
  const questionPanel = document.querySelector("#main-form");

  for (let i = 0; i < quizContent.length; i++) {
    console.log(quizContent[i]);
    questionPanel.appendChild(parseQuestion(quizContent[i]));
  }
}

main();

},{"./quiz-parse.js":2}],2:[function(require,module,exports){
module.exports = parseQuestion;

function parseQuestion(question) {
  const questionHTML = document.createElement("div");
  const questionTitle = document.createElement("h2");

  questionTitle.innerText = question.question;
  questionTitle.classList.add("center-align");

  questionHTML.id = "question-" + question.id;
  questionHTML.classList.add("question-block");
  questionHTML.appendChild(questionTitle);

  switch(question.type) {
    case "multi-choice":
      console.log(question);
      questionHTML.appendChild(multiChoice(question.answers, question.id));
      break;
    default:
      console.log("Quesion is of an unknown type.");
      return null;
  }

  console.log(questionHTML);

  return questionHTML;
}

function multiChoice(answers, n) {
  console.log(answers);
  const container = document.createElement("div");

  for (let i = 0; i < answers.length; i++) {
    const choice = answers[i];

    let inputHTML = document.createElement("input");
    let labelHTML = document.createElement("label");
    let labelText = document.createElement("span");

    inputHTML.setAttribute("type", "radio");
    inputHTML.setAttribute("name", "question-" + n);
    inputHTML.setAttribute("value", choice.dish);

    labelText.innerText = choice.text;

    labelHTML.appendChild(inputHTML);
    labelHTML.appendChild(labelText);

    container.appendChild(labelHTML);
    container.appendChild(document.createElement("br"));
  }

  return container;
}

},{}]},{},[1]);
