"use client";

import { createContext, useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface UiContextProps {
  isScrollTop: boolean;
  isCloudActive: boolean;
}
const initialState: UiContextProps = {
  isScrollTop: true,
  isCloudActive: true,
};

export const UiContext = createContext<UiContextProps>(initialState);

export const UiProvider = ({ children }: { children: React.ReactNode }) => {
  const isBrowser = typeof window !== "undefined";

  const [isScrollTop, setIsScrollTop] = useState<boolean>(true);
  const [isCloudActive, setIsCloudActive] = useState<boolean>(true);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isBrowser) return;

    const handleScroll = () => {
      setIsScrollTop(window.scrollY <= 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isBrowser]);

  useEffect(() => {
    setIsCloudActive(getIsCloudActive(isScrollTop, pathname, searchParams));
  }, [isScrollTop, pathname, searchParams]);

  return <UiContext.Provider value={{ isScrollTop, isCloudActive }}>{children}</UiContext.Provider>;
};

const getIsCloudActive = (isScrollTop: boolean, pathname: string, searchParams: URLSearchParams) => {
  const isParamsEmpty = searchParams.size === 0;
  const isMainPage = pathname === "/";
  return isParamsEmpty && isMainPage && isScrollTop;
};
