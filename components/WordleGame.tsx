// components/WordleGame.tsx
"use client"

import { useState, useEffect, FormEvent } from 'react';
import { getRandomWord, checkGuess, CheckResult } from '../utils/wordle';
import Popup from './Popup';

interface Guess {
  guess: string;
  result: CheckResult;
}

const initialGuesses: Guess[] = Array(6).fill({ guess: '     ', result: Array(5).fill('white') });

export default function WordleGame() {
  const [word, setWord] = useState<string>('');
  const [guesses, setGuesses] = useState<Guess[]>(initialGuesses);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    setWord(getRandomWord());
  }, []);

  useEffect(()=> {

    if(gameOver){

      for(let i = 0; i<guesses.length; i++){
        if(guesses[i].result.every((r) => r === 'green')){
          setShowPopup(true);
          return;
        }
      }
    }

  }, [gameOver])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentGuess.length === 5) {
      const result = checkGuess(word, currentGuess);
      
      const newGuesses = guesses;
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
      }
      if(newGuesses[5].guess !== '     '){
        setGameOver(true);
      }
    }
  };

  const closePopup = async() => {
    // Optionally, reset the game here
    console.log('closePopup')
    setWord(getRandomWord());
    setGuesses(initialGuesses);
    setCurrentGuess('');
    setGameOver(false);
    setShowPopup(false);
    console.log('closePopupasfasd')

  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-center'>
      <h1>Wordle Clone</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          maxLength={5}
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value)}
          disabled={gameOver}
        />
        <button type="submit">Submit</button>
      </form>
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
      {showPopup && <Popup message="Congratulations! You've won!" onClose={closePopup} />}
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
          width: 2em;
          height: 2em;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #000;
          margin: 0.1em;
        }
        .green {
          background-color: green;
          color: white;
        }
        .yellow {
          background-color: yellow;
          color: black;
        }
        .gray {
          background-color: gray;
          color: white;
        }
        .white {
          background-color: white;
          border: 1px solid black;
          border-radius: 10%;
        }
      `}</style>
    </div>
  );
}
