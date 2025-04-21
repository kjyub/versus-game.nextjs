'use client'

import { createContext, useEffect, useState } from 'react'

interface UiContextProps {
  isScrollTop: boolean
}
const initialState: UiContextProps = {
  isScrollTop: true,
}

export const UiContext = createContext<UiContextProps>(initialState)

export const UiProvider = ({ children }: { children: React.ReactNode }) => {
  const isBrowser = typeof window !== 'undefined'

  const [isScrollTop, setIsScrollTop] = useState<boolean>(true)

  useEffect(() => {
    if (!isBrowser) return

    const pageRoot = document.getElementById('page-root')
    if (!pageRoot) return

    const handleScroll = () => {
      setIsScrollTop(pageRoot.scrollTop === 0)
    }

    pageRoot.addEventListener('scroll', handleScroll)

    return () => {
      console.log('remove scroll event listener')
      pageRoot.removeEventListener('scroll', handleScroll)
    }
  }, [isBrowser])

  return (
    <UiContext.Provider value={{ isScrollTop }}>
      ss
      {children}
    </UiContext.Provider>
  )
}
