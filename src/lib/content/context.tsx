"use client";

import { createContext, useContext } from "react";
import { DEFAULT_CONTENT } from "./defaults";
import type { SiteContent } from "./schema";

const SiteContentContext = createContext<SiteContent>(DEFAULT_CONTENT);

export function SiteContentProvider({
  content,
  children,
}: {
  content: SiteContent;
  children: React.ReactNode;
}) {
  return <SiteContentContext.Provider value={content}>{children}</SiteContentContext.Provider>;
}

/** Reads the editable site document in any client component. */
export function useSiteContent(): SiteContent {
  return useContext(SiteContentContext);
}
