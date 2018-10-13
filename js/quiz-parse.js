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
