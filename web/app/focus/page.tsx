"use client";
import Link from "next/link";
import { useState } from "react";
import { Mode } from "./types";
import Pomodoro from "./Pomodoro";

export default function FocusPage() {
  const [mode, setMode] = useState<Mode>("Focus");
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center transition-colors
      duration-1000 ${mode === "Focus" ? "bg-indigo-600" : "bg-green-400"}`}
    >
      <Pomodoro mode={mode} setMode={setMode} />
    </div>
  );
}
