const fs = require('fs');

function parseQuizData(filePath) {
  const data = fs.readFileSync(filePath, 'utf8');
  const lines = data.split('\n');

  let quizzes = [];
  let quizObject = {
    question: '',
    answers: [],
    correct: ''
  };

  let hasQuestion = false;
  let hasAnswer = false;
  let hasCorrect = false;
  let answerCount = 0;

  lines.forEach(line => {
    if (line.startsWith('$Q:')) {
      if (quizObject.question) {
        if (!hasAnswer || !hasCorrect) {
          throw new Error('Invalid format: $Q found before completing the previous question.');
        }
        quizzes.push(quizObject);
      }
      
      quizObject = {
        question: '',
        answers: [],
        correct: ''
      };
      quizObject.question = line.substring(3).trim();
      hasQuestion = true;
      hasAnswer = false;
      hasCorrect = false;
      answerCount = 0;
    } else if (line.startsWith('$A:')) {
      if (!hasQuestion) {
        throw new Error('Invalid format: $A found before $Q.');
      }
      if (hasCorrect) {
        throw new Error('Invalid format: $A found after $C.');
      }
      quizObject.answers.push(line.substring(3).trim());
      hasAnswer = true;
      answerCount += 1;
    } else if (line.startsWith('$C:')) {
      if (!hasQuestion || !hasAnswer) {
        throw new Error('Invalid format: $C found before $Q or $A.');
      }
      if (hasCorrect) {
        throw new Error('Invalid format: Duplicate $C found.');
      }
      quizObject.correct = line.substring(3).trim();
      hasCorrect = true;
    }
  });

  // After processing all lines, add the last question if valid
  if (quizObject.question) {
    if (!hasAnswer || !hasCorrect) {
      throw new Error('Invalid format: Missing $A or $C for the last question.');
    }
    quizzes.push(quizObject);
  }

  return quizzes;
}

module.exports = parseQuizData;
