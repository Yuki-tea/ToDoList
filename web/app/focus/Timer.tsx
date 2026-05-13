"use client";

import { Mode } from "./types";

type Props = {
  time: number;
  mode: Mode;
};

export default function Timer({ time, mode }: Props) {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  return (
    <div
      className={`text-7xl font-cause tabular-nums font-bold mb-4 drop-shadow-sm transition-colors duration-500 ${
        mode === "Focus" ? "text-white" : "text-emerald-900"
      }`}
    >
      {min}:{sec.toString().padStart(2, "0")}
    </div>
  );
}
