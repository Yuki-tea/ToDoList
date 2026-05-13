"use client";

import { useState, useEffect } from "react";
import Timer from "./Timer";

type Mode = "Focus" | "Break" | "LongBreak";
//const FOCUS = 25 * 60;
//const BREAK = 5 * 60;
//const LONG_BREAK = 15 * 60;
const FOCUS = 10;
const BREAK = 5;
const LONG_BREAK = 15;
const ROUTINE = 4;

export default function Pomodoro() {
  const [timeCount, setTimeCount] = useState(FOCUS);
  const [roundCount, setRoundCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<Mode>("Focus");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeCount > 0) {
      interval = setInterval(() => {
        setTimeCount((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeCount === 0) {
      setIsActive(false);
      switchMode();
    }

    return () => clearInterval(interval);
  }, [isActive, timeCount]);

  const switchMode = () => {
    if (mode === "Focus") {
      setRoundCount((prev) => prev + 1);
      // setRoundCountが非同期処理だからこの時点ではまだcountが増えていない
      if ((roundCount + 1) % ROUTINE === 0) {
        setMode("LongBreak");
        setTimeCount(LONG_BREAK);
      } else {
        setMode("Break");
        setTimeCount(BREAK);
      }
    } else {
      setMode("Focus");
      setTimeCount(FOCUS);
    }
  };

  const reset = () => {
    setIsActive(false);
    setTimeCount(FOCUS);
    setMode("Focus");
  };

  return (
    <div className={mode === "Focus" ? "bg-red-500" : "bg-blue-500"}>
      <div>
        <h1 className="text-black">{roundCount}</h1>
        <Timer time={timeCount} />
        <div>
          <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold" onClick={() => setIsActive(!isActive)}>
            {isActive ? "Pause" : "Start"}
          </button>
          {!isActive && <button className="ml-4 text-gray-500 hover:text-gray-700" onClick={() => reset()}> reset </button>}
        </div>
      </div>
    </div>
  );
}
