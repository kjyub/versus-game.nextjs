"use client";

import { createContext, useEffect, useState } from "react";

interface UiContextProps {
  isScrollTop: boolean;
}
const initialState: UiContextProps = {
  isScrollTop: true,
};

export const UiContext = createContext<UiContextProps>(initialState);

export const UiProvider = ({ children }: { children: React.ReactNode }) => {
  const isBrowser = typeof window !== "undefined";

  const [isScrollTop, setIsScrollTop] = useState<boolean>(true);

  useEffect(() => {
    if (!isBrowser) return;

    const handleScroll = () => {
      setIsScrollTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isBrowser]);

  return <UiContext.Provider value={{ isScrollTop }}>{children}</UiContext.Provider>;
};
