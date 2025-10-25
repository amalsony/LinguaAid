"use client";

import React, { createContext, useContext, useState } from "react";
import clsx from "clsx";

type Ctx = {
  a11y: boolean;
  toggle: (next?: boolean, silent?: boolean) => void;
};

const A11yContext = createContext<Ctx | null>(null);

export function A11yProvider({ children }: { children: React.ReactNode }) {
  const [a11y, setA11y] = useState(false);

  const toggle = (next?: boolean, silent?: boolean) => {
    const v = typeof next === "boolean" ? next : !a11y;
    if (!silent) setA11y(v);
    else setA11y(v); // same but skips side effects if you add any later
  };

  return (
    <A11yContext.Provider value={{ a11y, toggle }}>
      <div
        className={clsx(
          // Accessible mode: slightly larger text, more contrast, bigger hit targets
          a11y && "text-[1.08rem] leading-relaxed contrast-125"
        )}
      >
        {children}
      </div>
    </A11yContext.Provider>
  );
}

export const useA11y = () => {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y must be used within A11yProvider");
  return ctx;
};