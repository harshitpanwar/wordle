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

    if(dictionaryMap.get(currentGuess) === undefined){
      // set error in the input field
      setInputError(true);
      return;
    }
    else{
      setInputError(false);
    }
    console.log(word);
    if (currentGuess.length === 5) {
      const result = checkGuess(word, currentGuess);
      
      const newGuesses = [...guesses];
      for(let i = 0; i<guesses.length; i++){
        if(guesses[i].guess === '     '){
          newGuesses[i] = { guess: currentGuess, result };
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
      <h1 className=''>Wordle</h1>
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
        <form onSubmit={handleSubmit}>
          <input
            className='border rounded border-black border-solid p-2 mt-5'
            placeholder='Enter your guess'
            type="text"
            maxLength={5}
            value={currentGuess}
            onChange={(e) => setCurrentGuess(e.target.value)}
            disabled={gameOver}
          />
          {inputError && <p className='text-red-500' >{ERROR_MESSAGE}</p>}
          {/* <button type="submit">Submit</button> */}
        </form>
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
