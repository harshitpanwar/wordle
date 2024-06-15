import { dictionary } from "./dictionary";

export const WORDS: string[] = dictionary;

export function getRandomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export type CheckResult = ("green" | "yellow" | "gray" | "white")[];

export function checkGuess(word: string, guess: string): CheckResult {
  const result: CheckResult = Array(5).fill(null);
  const wordArray = word.split('');
  const guessArray = guess.split('');

  // First pass: check for correct letters in the correct positions
  for (let i = 0; i < 5; i++) {
    if (guessArray[i] === wordArray[i]) {
      result[i] = 'green';
      wordArray[i] = "";
      guessArray[i] = "";
    }
  }

  // Second pass: check for correct letters in the wrong positions
  for (let i = 0; i < 5; i++) {
    if (guessArray[i] && wordArray.includes(guessArray[i])) {
      result[i] = 'yellow';
      wordArray[wordArray.indexOf(guessArray[i])] = "";
    } else if (guessArray[i]) {
      result[i] = 'gray';
    }
  }

  return result;
}
