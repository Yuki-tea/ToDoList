"use client";

import { useState, useEffect } from "react";
import { Mode } from "./types";
import Timer from "./Timer";

type Props = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

const FOCUS = 25 * 60;
const BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;
const ROUTINE = 4;

export default function Pomodoro({ mode, setMode }: Props) {
  const [timeCount, setTimeCount] = useState(FOCUS);
  const [roundCount, setRoundCount] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && endTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));

        if (remaining === 0) {
          setIsActive(false);
          setEndTime(null);
          setTimeCount(0);
          switchMode();
        } else {
          setTimeCount(remaining);
        }
      }, 100); // チェック頻度を上げ、描画の遅延を防ぐ
    }

    return () => clearInterval(interval);
  }, [isActive, endTime]);

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

  const toggleActive = () => {
    if (!isActive) {
      // 開始・再開する時に、今の残り秒数から終了時刻を「固定」する
      setEndTime(Date.now() + timeCount * 1000);
    } else {
      // 一時停止する時は終了時刻を破棄する
      setEndTime(null);
    }
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setEndTime(null);
    setTimeCount(FOCUS);
    setMode("Focus");
  };

  return (
    <div
      className={`transition-colors duration-1000 p-10 rounded-3xl shadow-2xl ${mode === "Focus" ? "bg-blue-400" : "bg-emerald-300"}`}
    >
      <div className="flex flex-col items-center">
        {/* The Owl Character */}
        <div className="w-48 h-48 mb-6 bg-black rounded-full flex items-center justify-center p-4 shadow-inner">
          <img
            src="https://api.iconify.design/fluent-emoji:owl.svg"
            alt="Focused Owl"
            className={"w-36 h-36 transition-transform duration-500"}
          />
        </div>

        <div className="mb-2">
          <span className="px-3 py-1 bg-white rounded-full text-xs font-bold tracking-widest text-indigo-600 uppercase shadow-sm">
            Round {roundCount}
          </span>
        </div>

        <h2
          className={`text-2xl font-bold mb-4 transition-colors ${mode === "Focus" ? "text-indigo-600" : "text-emerald-600"}`}
        >
          {mode === "Focus" ? "Stay Focused" : "Take a Break"}
        </h2>

        <Timer time={timeCount} mode={mode} />

        <div className="flex items-center gap-4 mt-6">
          <button
            className={`px-10 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 ${
              isActive
                ? "bg-gray-400 hover:bg-gray-500"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-300"
            }`}
            onClick={toggleActive}
          >
            {isActive ? "PAUSE" : "START"}
          </button>

          {!isActive && (
            <button
              className="text-gray-300 hover:text-gray-600 font-medium transition-colors"
              onClick={reset}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
