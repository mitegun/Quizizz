let currentQuizData = null;
let lastLoggedQuestion = "";

async function fetchQuizAnswers(quizCode) {
  const url = "https://v3.schoolcheats.net/quizizz/answers";
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const data = { input: quizCode };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP! statut: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    if (responseData.error) {
      throw new Error(responseData.message || "Erreur API inconnue");
    }
    
    return responseData;
  } catch (error) {
    console.error("Erreur de récupération:", error);
    return null;
  }
}

function cleanHtml(rawHtml) {
  const doc = new DOMParser().parseFromString(rawHtml, "text/html");
  return doc.body.textContent || "";
}

function displayAnswers(quizData) {
  if (!quizData) {
    console.error("Erreur: Aucune donnée de quiz reçue");
    return;
  }

  if (!quizData.questions || !Array.isArray(quizData.questions)) {
    console.error("Erreur: Format des questions invalide");
    return;
  }

  const tableData = quizData.questions.map((questionData) => {
    const questionText = cleanHtml(questionData.structure?.query?.text || "Question sans texte");
    let answerText = "Type de question inconnu";

    try {
      switch (questionData.structure?.kind) {
        case "MCQ":
          const mcqAnswers = [].concat(questionData.structure.answer);
          answerText = mcqAnswers
            .map(index => questionData.structure.options?.[index]?.text)
            .filter(text => text)
            .map(cleanHtml)
            .join(", ") || "Réponse MCQ non valide";
          break;

        case "BLANK":
          const blankAnswers = [].concat(questionData.structure.answer);
          answerText = blankAnswers
            .map(answer => typeof answer === 'object' ? answer.text : answer)
            .filter(text => text)
            .map(cleanHtml)
            .join(", ") || "Réponse vide non valide";
          break;

        default:
          answerText = "Type de question non supporté";
      }
    } catch (error) {
      console.warn("Erreur de traitement de la question:", error);
      answerText = "Erreur de traitement";
    }

    return { 
      "#": questionData.index != null ? questionData.index + 1 : "N/A",
      Question: questionText,
      Answer: answerText || "Aucune réponse disponible"
    };
  });

  console.table(tableData);
}

function monitorQuestionAndHighlight() {
  console.log("Monitoring")
  const questionElement = document.querySelector('.question-text-color p');
  if (!questionElement) return;
  
  const displayedQuestion = questionElement.textContent.trim();
  
  if (currentQuizData && currentQuizData.questions) {
    const matchingQuestion = currentQuizData.questions.find(q => {
      const questionText = cleanHtml(q.structure?.query?.text || "");
      return questionText.trim() === displayedQuestion;
    });
    
    if (matchingQuestion) {
      let answerText = "";
      switch (matchingQuestion.structure.kind) {
        case "MCQ":
          const mcqAnswers = [].concat(matchingQuestion.structure.answer);
          answerText = mcqAnswers
            .map(index => matchingQuestion.structure.options?.[index]?.text)
            .filter(text => text)
            .map(cleanHtml)
            .join(", ");
          break;
        case "BLANK":
          const blankAnswers = [].concat(matchingQuestion.structure.answer);
          answerText = blankAnswers
            .map(answer => typeof answer === 'object' ? answer.text : answer)
            .filter(text => text)
            .map(cleanHtml)
            .join(", ");
          break;
        default:
          answerText = "";
      }
      
      if (answerText) {
        if (displayedQuestion !== lastLoggedQuestion) {
          console.log("Question actuelle:", displayedQuestion);
          console.log("Réponse correcte:", answerText);
          lastLoggedQuestion = displayedQuestion;
        }
        
        const buttons = document.querySelectorAll('button.option');
        buttons.forEach(button => {
          const optionTextElement = button.querySelector('#optionText p');
          if (optionTextElement) {
            optionTextElement.style.pointerEvents = 'none';
            
            if (optionTextElement.textContent.trim() === answerText.trim()) {
              button.classList.add('highlight-answer');
            } else {
              button.classList.remove('highlight-answer');
            }
          }
        });
      }
    }
  }
}

function injectHighlightStyle() {
  const style = document.createElement('style');
  style.textContent = `
    .highlight-answer {
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
      transition: all 0.3s ease;
    }

    .highlight-answer:hover {
      background-color: rgba(255, 255, 255, 0.15) !important;
      box-shadow: 0 0 5px rgba(255, 255, 255, 0.3) !important;
      cursor: pointer !important;
    }

    #optionText p {
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);
}


setInterval(monitorQuestionAndHighlight, 1000);

async function main() {
  try {
    injectHighlightStyle();
    const quizCode = prompt("Entrez le code du quiz:");
    if (!quizCode) {
      alert("Code de quiz invalide");
      return;
    }
    
    currentQuizData = await fetchQuizAnswers(quizCode);
    displayAnswers(currentQuizData);
  } catch (error) {
    console.error("Erreur d'exécution:", error);
    alert("Erreur - Voir la console pour les détails");
  }
}

main();