"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import Die from "./Die";
import useLocalStorageState from "./hooks/useLocalStorageState";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

interface Die {
  value: number;
  isHeld: boolean;
  id: string;
}

interface DieState {
  dice: Die[];
  tenzies: boolean;
  numRolls: number;
  startTime: number;
  timeTaken: number;
  bestNumRolls: number;
  bestTimeTaken: number;
}

export default function Home() {
  const [dice, setDice] = useState<Die[]>([]);
  const [numRolls, setNumRolls] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [tenzies, setTenzies] = useState(false);
  const [bestNumRolls, setBestNumRolls] = useLocalStorageState(
    "bestNumRolls",
    0
  );
  const [bestTimeTaken, setBestTimeTaken] = useLocalStorageState(
    "bestTimeTaken",
    0
  );

  // console.log(`start, timeTaken, numRolls: ${timeTaken}, ${numRolls}`)
  // console.log(`start, best - timeTaken, numRolls: ${bestTimeTaken}, ${bestNumRolls}`)

  useEffect(() => {
    // Runs once, after hydration (client)
    setDice(allNewDice());
    setStartTime(performance.now());
  }, []);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      // Game won
      setTenzies(true);

      // Check if this is the best time
      const timeRecorded = performance.now() - startTime;
      setTimeTaken(timeRecorded);
      // console.log("timeRecorded: ", timeRecorded)
      // console.log("timetaken: ", timeTaken)

      setBestTimeTaken((oldBestTimeTaken: number): number => {
        // console.log("timeRecorded: ", timeRecorded)
        // console.log("oldtimetaken: ", oldBestTimeTaken)

        if (oldBestTimeTaken === 0 || timeRecorded < oldBestTimeTaken) {
          return timeRecorded;
        } else {
          return oldBestTimeTaken;
        }
      });

      // Check if this is the best number of rolls
      setBestNumRolls((oldNumRolls: number) =>
        numRolls < oldNumRolls ? numRolls : oldNumRolls
      );
    }
  }, [dice]);

  function resetGame() {
    setTenzies(false);
    setDice(allNewDice());
    setNumRolls(0);
    setTimeTaken(0);
    setStartTime(performance.now());
  }

  // https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
  function formatTimeTaken(millis: number) {
    var minutes: number = Math.floor(millis / 60000);
    var seconds: string = ((millis % 60000) / 1000).toFixed(0);

    return parseInt(seconds) == 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (parseInt(seconds) < 10 ? "0" : "") + seconds;
  }

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    // If game not won, then refresh non held dice
    if (!tenzies) {
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setNumRolls((oldNum) => oldNum + 1);
    } else {
      // Game was won, reset it!
      resetGame();
    }
  }

  function holdDice(id: string) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main className="w-full h-svh grid place-items-center">
      <div className="game-container">
        {tenzies && <Confetti />}
        <h1 className="title">Tenzies</h1>
        <p className="instructions">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className="dice-container">{diceElements}</div>
        <button className="roll-dice" onClick={rollDice}>
          {tenzies ? "New Game" : "Roll"}
        </button>
      </div>
    </main>
  );
}
