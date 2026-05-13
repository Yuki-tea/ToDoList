"use client";

type Props = {
  time: number;
};

export default function Timer(Props: { time: number }) {
  const min = Math.floor(Props.time / 60);
  const sec = Props.time % 60;
  return (
    <div className="text-6xl text-black font-mono mb-4">
      {min}:{sec.toString().padStart(2, "0")}
    </div>
  );
}
