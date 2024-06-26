// components/WordleGame.tsx
"use client"

import { useState, useEffect, FormEvent } from 'react';
import { getRandomWord, checkGuess, CheckResult } from '../utils/wordle';
import Popup from './Popup';
import { WORDS } from '../utils/wordle';

interface Guess {
  guess: string;
  result: CheckResult;
}

const initialGuesses: Guess[] = Array(6).fill({ guess: '     ', result: Array(5).fill('white') });
const ERROR_MESSAGE = 'Please enter a valid 5-letter word from the dictionary';
const dictionaryMap = new Map<string, boolean>();
for (const word of WORDS) {
  dictionaryMap.set(word, true);
}

export default function WordleGame() {
  const [word, setWord] = useState<string>('');
  const [guesses, setGuesses] = useState<Guess[]>(initialGuesses);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [errorPopup, setErrorPopup] = useState<boolean>(false);
  const [inputError, setInputError] = useState<boolean>(false);

  useEffect(() => {
    setWord(getRandomWord());
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(dictionaryMap.get(currentGuess.toLowerCase()) === undefined){
      // set error in the input field
      setInputError(true);
      return;
    }
    else{
      setInputError(false);
    }
    console.log(word);
    if (currentGuess.length === 5) {
      const result = checkGuess(word, currentGuess.toLowerCase());
      
      const newGuesses = [...guesses];
      for(let i = 0; i<guesses.length; i++){
        if(guesses[i].guess === '     '){
          newGuesses[i] = { guess: currentGuess.toLowerCase(), result };
          break;
        }
      }

      setGuesses(newGuesses);
      setCurrentGuess('');
      if (result.every((r) => r === 'green')) {
        setGameOver(true);
        setTimeout(() => {
          setShowPopup(true);
          resetBoard();  
        }, 1000);
        return;
      }
      if(newGuesses[5].guess !== '     '){
        setGameOver(true);
        setTimeout(() => {
          setErrorPopup(true);
          resetBoard();  
        }, 1000);
        return;
      }
    }
  };

  const closePopup = async() => {
    setShowPopup(false);
    setErrorPopup(false);
  };
  const resetBoard = () => {
    setWord(getRandomWord());
    setGuesses(initialGuesses);
    setCurrentGuess('');
    setGameOver(false);
  };


  return (
    <div className='flex flex-col items-center'>
      <h1 className="text-4xl font-bold text-center text-gray-900 font-roboto mt-5">
          Wordle
      </h1>
      <div className='flex flex-col items-center justify-center min-h-screen text-center'>
        <div>
          {guesses.map((guessObj, index) => (
            <div key={index} className="guess">
              {guessObj.guess.split('').map((letter, i) => (
                <span key={i} className={`letter ${guessObj.result[i]}`}>
                  {letter}
                </span>
              ))}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className='flex items-center justify-center mt-5'>
        <input
          className="border rounded border-black border-solid p-2 mr-2"
          placeholder="Enter your guess"
          type="text"
          maxLength={5}
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value)}
          disabled={gameOver}
        />
          <button className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit"
          disabled={gameOver}
          >
            Submit
          </button>
        </form>
        {inputError && <p className='text-red-500' >{ERROR_MESSAGE}</p>}
        {showPopup && <Popup message="Congratulations! You've won!" onClose={closePopup} />}
        {errorPopup && <Popup message="You've lost!" onClose={closePopup} />}
        <style jsx>{`
          .game-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            text-align: center;
          }
          .guess {
            display: flex;
          }
          .letter {
            width: 3.5em;
            height: 3.5em;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #000;
            margin: 0.1em;
            font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;

          }
          .green {
            background-color: #6baa65;
            color: white;
            border: 2px solid #d5d6d9;

          }
          .yellow {
            background-color: #c9b457;
            color: black;
            border: 2px solid #d5d6d9;

          }
          .gray {
            background-color: #787c7f;
            color: white;
            border: 2px solid #d5d6d9;

          }
          .white {
            background-color: white;
            border: 2px solid #d5d6d9;
            border-radius: 10%;
          }
        `}</style>
      </div>
    </div>

  );
}
