import clsx from "clsx"
import Confetti from 'react-confetti'
import { useState } from 'react'
import { languages } from '../languages.js'
import { getRandomWord, getFarewellText } from "../utils.js"


function App() {

  // State Values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])

  // Derived Values
  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length

  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1
  const isGameOver = isGameWon || isGameLost

  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  // Static Values
  const alphabets = "abcdefghijklmnopqrstuvwxyz"

  // Clicking Each Word
  function handleClick(value){
    setGuessedLetters(prevLetters => 
      prevLetters.includes(value) ? prevLetters : [...prevLetters, value]
    )
  }
  
  // Current Word (the word to be guessed)
  const wordEls = Array.from(currentWord).map((letter, index) => {
    
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && 'missed-letter'
    )
    
    return ( 
      <span key={index} className={letterClassName}>
        {
          ( isGameLost && letter.toUpperCase() ) 
          || 
          (guessedLetters.includes(letter)  ? letter.toUpperCase() : "") 
        }
      </span>
    )
  })
  
  // Keyboard Buttons
  const keyBtns = alphabets.split("").map((letter, index) => {
    
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)

    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return (
        <button 
          key={index} 
          onClick={() => handleClick(letter)}
          className={className}
          disabled={isGameOver}
        >
          {letter.toUpperCase()}
        </button>
      )
  })

   // All languages
   const elements = languages.map((obj, index) => {
    
    const isLanguageLost = index < wrongGuessCount
    
    const styles = {
      backgroundColor: obj.backgroundColor,
      color: obj.color
    }

    const className = clsx('chip', isLanguageLost && "lost")
    
    return (
      <span 
        className={className} 
        style={styles}
        key={obj.name}
      >
        {obj.name}
      </span>
    )
  }) 

  const gameStatusClass = clsx('status', {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect 
  })

  function renderGameStatus(){
    if(!isGameOver && isLastGuessIncorrect){
      const farewellText = wrongGuessCount > 0 && wrongGuessCount <= languages.length 
      ? getFarewellText(languages[wrongGuessCount - 1].name) : "";

      return (
        <p className="farwell-message">
          {farewellText}
        </p>
      ) 
    }

    if(isGameWon){
      return (
        <>
          <h2>You Win!</h2>
          <p>Well Done! </p>
        </>
      )
    }

    if(isGameLost){

      return (
        <>
          <h2>Game Over!</h2>
          <p>Better Luck Next Time </p>
        </>
      )
    }

    return null
    
  }

  function resetGame(){
    setCurrentWord(() => getRandomWord())
    setGuessedLetters([])
  }

  return (
    <main>
      {
        isGameWon && (
          <Confetti 
            width={window.innerWidth} 
            height={window.innerHeight} 
            recycle={false}
            numberOfPieces={400}
            gravity={0.2}
            colors={['#004D98', '#A50044', '#EDBB00']} 
          />
        )
      }
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>
      <section className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      <section className="languages">
        {elements}
      </section>
      <section className="word">
        {wordEls}
      </section>
      <section className='keyboard'>
        {keyBtns}
      </section>
      {isGameOver && <button className="new-game" onClick={resetGame}>New Game</button>}
    </main>
  )
}

export default App
