import { useEffect, useRef } from 'react'
import { ISetDivIntersected } from '../features/qfd/QFDMain'

export const useScrollObserver = (
  setDivIntersected: ISetDivIntersected,
  componentScrollNumber: number,
): React.MutableRefObject<HTMLElement | null>[] => {
  const isRef = useRef<HTMLElement | null>(null)
  // threshold : 영역 비율, rootMargin : 영역 마진
  const option = { threshold: 0.5, rootMargin: `-40px 0px -40px` }
  useEffect(() => {
    const observer = new IntersectionObserver((entry) => {
      if (entry[0].isIntersecting) {
        setDivIntersected(componentScrollNumber, entry[0])
      } else {
      }
    }, option)

    if (isRef.current) {
      observer.observe(isRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return [isRef]
}
