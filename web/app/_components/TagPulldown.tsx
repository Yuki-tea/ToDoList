"use client";

import { useState, useTransition, useContext } from "react";
import { TagContext } from "./TagContext";
import { toggleTaskTag } from "../actions";
import { Tag } from "@/lib/api";

type Props = {
  taskId: number;
  attachedTags?: Tag[];
};

export function TagPulldown({ taskId, attachedTags = [] }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  // 登録されているタグ一覧
  const allTags = useContext(TagContext);
  // 既にタスクに紐づけされているタグのidのリスト
  const attachedTagIds = attachedTags?.map((t) => t.id) || [];

  const handleToggleTag = (tagId: number, isAttached: boolean) => {
    startTransition(async () => {
      await toggleTaskTag(taskId, tagId, isAttached);
    });
  };

  if (allTags.length === 0) return null;

  return (
    <>
      {/* タグ追加ドロップダウン */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full cursor-pointer hover:bg-gray-200 transition-colors border border-transparent hover:border-gray-300 flex items-center gap-1"
        >
          ＋ タグ{isOpen ? "▲" : "▼"}
        </button>
        {/* ドロップダウンの中身 */}
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-100 rounded-lg shadow-xl p-2 z-20 w-48 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-3 h-3"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <p className="text-xs text-gray-500 mb-2 font-bold border-b pb-1 px-1">
              タグを選択
            </p>
            <div className="flex flex-col gap-0.5">
              {allTags.map((tag) => {
                const isAttached = attachedTagIds.includes(tag.id);
                return (
                  <label
                    key={tag.id}
                    className={`flex items-center gap-2 text-sm p-1.5 cursor-pointer rounded transition-colors ${
                      isAttached ? "bg-green-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isAttached}
                      onChange={() => handleToggleTag(tag.id, isAttached)}
                      disabled={isPending} // 通信中は連打できないようにする
                      className="accent-green-600 w-4 h-4 cursor-pointer"
                    />
                    <span
                      className={
                        isAttached
                          ? "font-bold text-green-700"
                          : "text-gray-700"
                      }
                    >
                      {tag.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
