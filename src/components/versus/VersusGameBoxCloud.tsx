'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useUi } from '@/hooks/useUi';
import { useLayoutEffect, useRef, useState } from 'react';

export const CLOUD_COUNT = 20; // 몇개의 박스만 클라우딩 할 지

interface StyleValues {
  direction: number; // 왼쪽 or 오른쪽
  distance: number; // 인덱스별 옆으로 가는 거리
  height: number; // 인덱스별 솟아오르는 거리 차이
  blur: number; // 인덱스별 블러 효과
}
const initialStyleValues: StyleValues = {
  direction: 0,
  distance: 0,
  height: 0,
  blur: 0,
} as const;

const getDelay = () => {
  return Math.random() * 2 + 1;
};

const getDirection = (index: number) => {
  return index % 2 === 0 ? -1 : 1;
};

const getDistance = (index: number) => {
  const random = Math.random() * 10 + 5;
  return -50 + index * random;
};

const getHeight = (index: number) => {
  return 100 + index * 10 * -1;
};

const getBlur = (index: number) => {
  return index * 0.045;
};

export default function VersusGameBoxCloud({ index, children }: { index: number; children: React.ReactNode }) {
  const { isCloudActive: isCloudActiveUi } = useUi();
  const [isMobile] = useMediaQuery(['(max-width: 768px)']);

  const [isCloudActive, setIsCloudActive] = useState<boolean>(false);
  const [styleValues, setStyleValues] = useState<StyleValues>(initialStyleValues);

  const cloudActiveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    if (index > CLOUD_COUNT) {
      return;
    }

    if (isCloudActiveUi) {
      setStyleValues({
        direction: getDirection(index),
        distance: getDistance(CLOUD_COUNT - index),
        height: getHeight(CLOUD_COUNT - index),
        blur: getBlur(CLOUD_COUNT - index),
      });

      cloudActiveTimerRef.current = setTimeout(() => {
        setIsCloudActive(true);
      }, Math.random() * 3000);
    } else {
      setStyleValues(initialStyleValues);
      setIsCloudActive(false);
      if (cloudActiveTimerRef.current) {
        clearTimeout(cloudActiveTimerRef.current);
      }
    }
  }, [index, isCloudActiveUi]);

  if (index > CLOUD_COUNT || isMobile) {
    return children;
  }

  return (
    <div
      className="duration-800 will-change-transform hover:blur-none!"
      style={{
        transform: `translateX(${styleValues.direction * styleValues.distance}px) translateY(${styleValues.height}px)`,
        filter: `blur(${styleValues.blur}px)`,
      }}
    >
      <div className={`list-game-card-cloud ${isCloudActive ? 'active' : ''}`}>{children}</div>
    </div>
  );
}
