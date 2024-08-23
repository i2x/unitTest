const fs = require('fs');
const parseQuizData = require('./parseQuizData');

// Mocking the file system readFileSync method
jest.mock('fs');

describe('parseQuizData', () => {
  it('should correctly parse the quiz data from the string', () => {
    const fileContent = `
$Q: what is animal
$A: Car
$A: Human
$A: Cat
$A: Home
$C: Cat

$q: Is there anything that has wheels?
$a: Car
$A: Human
$A: Cat
$A: Home
$c: Car
`;

    // Mock the file reading
    fs.readFileSync.mockReturnValue(fileContent);

    const result = parseQuizData('validQuiz.txt');
    const expectedOutput = [
      {
        question: 'what is animal',
        answers: ['Car', 'Human', 'Cat', 'Home'],
        correct: 'Cat'
      },
      {
        question: 'Is there anything that has wheels?',
        answers: ['Car', 'Human', 'Cat', 'Home'],
        correct: 'Car'
      }
    ];

    expect(result).toEqual(expectedOutput);
  });

  it('should throw an error if $Q is found after $Q', () => {
    const fileContent = `
$Q: what is animal
$Q: Is there anything that has wheels?
$A: Car
$C: Car
`;

    fs.readFileSync.mockReturnValue(fileContent);

    expect(() => parseQuizData('duplicateQuestionQuiz.txt')).toThrow('Invalid format: $Q found before completing the previous question.');
  });

  it('should throw an error if $A is found before $Q', () => {
    const fileContent = `
$A: Car
$Q: what is animal
$C: Cat
`;

    fs.readFileSync.mockReturnValue(fileContent);

    expect(() => parseQuizData('answerBeforeQuestionQuiz.txt')).toThrow('Invalid format: $A found before $Q.');
  });

  it('should throw an error if $C is found before $Q or $A', () => {
    const fileContent = `
$C: Cat
$Q: what is animal
$A: Car
`;

    fs.readFileSync.mockReturnValue(fileContent);

    expect(() => parseQuizData('correctBeforeQuestionOrAnswerQuiz.txt')).toThrow('Invalid format: $C found before $Q or $A.');
  });

  it('should throw an error if there is a duplicate $C in a question', () => {
    const fileContent = `
$Q: what is animal
$A: Car
$A: Human
$C: Cat
$C: Home
`;

    fs.readFileSync.mockReturnValue(fileContent);

    expect(() => parseQuizData('duplicateCorrectQuiz.txt')).toThrow('Invalid format: Duplicate $C found.');
  });





});
