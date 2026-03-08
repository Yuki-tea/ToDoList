"use client";

import { createContext } from "react";
import { Tag } from "@/lib/api";

// 初期値として空の配列を設定
export const TagContext = createContext<Tag[]>([]);
