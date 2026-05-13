"use client";

type Props = {
  time: number;
};

export default function Timer({ time }: Props) {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  return (
    <div className="text-6xl text-black font-mono mb-4">
      {min}:{sec.toString().padStart(2, "0")}
    </div>
  );
}
