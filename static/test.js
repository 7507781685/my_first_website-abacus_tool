//security for code 
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("copy", e => e.preventDefault());
let testInProgress = true;
window.onbeforeunload = function () {
  if (testInProgress) {
    return "Test is in progress. Are you sure you want to leave?";
  }
};

//broser back button
history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};

//security end
//tab swich detection 
//end
let tabSwitchCount = 0;

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    tabSwitchCount++;
    if (tabSwitchCount >= 3) {
      alert("Too many tab switches. Test submitted.");
      submitTest();
    }
  }
});

//extra seurity part above from line 1 to this line 
//functions
function saveCurrentAnswer() {
  const selected = document.querySelector('input[name="opt"]:checked');
  if (selected) {
    userAnswers[currentQuestion] = Number(selected.value);
  }
}


/*question logic level zero*/
let currentQuestion = 0;
let userAnswers = [];
let questions = [];

/* LEVEL 0 QUESTION */
function generateLevel0Question() {
  const count = Math.floor(Math.random() * 5) + 4; // 4–8 digits
  let expr = "";
  let result = 0;

  for (let i = 0; i < count; i++) {
    let num = Math.floor(Math.random() * 10);
    if (i === 0) {
      expr += num;
      result = num;
    } else {
      let op = Math.random() > 0.5 ? "+" : "-";
      expr += op + num;
      result = op === "+" ? result + num : result - num;
    }
  }
  return { expr, result };
}

function generateOptions(correct) {
  let set = new Set([correct]);
  while (set.size < 4) {
    set.add(correct + Math.floor(Math.random() * 10 - 5));
  }
  return [...set].sort(() => Math.random() - 0.5);
}

/* CREATE 50 QUESTIONS */
for (let i = 0; i < 50; i++) {
  let q = generateLevel0Question();
  questions.push({
    question: q.expr,
    answer: q.result,
    options: generateOptions(q.result)
  });
}

function showQuestion() {
  let q = questions[currentQuestion];
  document.getElementById("questionBox").innerText =
    `Q${currentQuestion + 1}: ${q.question}`;

  let optHTML = "";
  q.options.forEach(opt => {
    optHTML += `
      <label>
        <input type="radio" name="opt" value="${opt}">
        ${opt}
      </label><br>`;
  });
  document.getElementById("optionsBox").innerHTML = optHTML;
  // Disable Privious at first questions
  document.getElementById("prevBtn").disabled = currentQuestion === 0;
  // Button text handling
  document.getElementById("nextBtn").innerText =
    currentQuestion === 49 ? "Submit Test" : "Next";

}

//function nextQuestion() {
//  let selected = document.querySelector('input[name="opt"]:checked');
//  userAnswers[currentQuestion] = selected ? Number(selected.value) : null;
//  //last question //submit
//  if (currentQuestion==49){
//    submitTest();
//    return;
//  }  
//  currentQuestion++;
//  showQuestion();
//    // Change button text on last question
//
//  if (currentQuestion === 49) {
//    document.getElementById("nextBtn").innerText="Submit Test";
//  }
//}
//new logic next function
function nextQuestion() {
//   let selected = document.querySelector('input[name="opt"]:checked');
//   if (selected) {
    // userAnswers[currentQuestion] = Number(selected.value);
//   }
  saveCurrentAnswer(); // ✅ ALWAYS save first
  if (currentQuestion === 49) {
    submitTest();
    return;
  }

  currentQuestion++;
  showQuestion();
}

showQuestion();
//privious question
function prevQuestion() {
//   let selected = document.querySelector('input[name="opt"]:checked');
//   if (selected) {
    // userAnswers[currentQuestion] = Number(selected.value);
//   }
  saveCurrentAnswer(); // ✅ ALWAYS save first
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion();
  }
}

//timer auto submit
let time = 300;

let timer = setInterval(() => {
  let m = Math.floor(time / 60);
  let s = time % 60;
  document.getElementById("timer").innerText =
    `${m}:${s < 10 ? "0" : ""}${s}`;

  if (time === 0) {
    clearInterval(timer);
    submitTest();
  }
  time--;
}, 1000);

//submit logic
function submitTest() {
  let correct = 0;
  let wrong = 0;
  let details = [];

  questions.forEach((q, i) => {
    let isCorrect = userAnswers[i] === q.answer;
    if (isCorrect) correct++;
    else wrong++;

    details.push({
      question: q.question,
      user: userAnswers[i],
      answer: q.answer,
      correct: isCorrect
    });
  });

  localStorage.setItem("result", JSON.stringify({ correct, wrong, details }));
  window.location.href = "/result";
}
