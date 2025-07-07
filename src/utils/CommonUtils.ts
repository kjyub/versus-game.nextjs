import { TextFormats } from '@/types/CommonTypes';
import dayjs, { type Dayjs } from 'dayjs';

import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko'); // 한글 설정

namespace CommonUtils {
  export function round(value: number, round = 0): number {
    // return Math.round(value * Math.pow(10, round)) / Math.pow(10, round)
    return Number(value.toPrecision(round));
  }
  export async function copyClipboard(value: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(value);
    } catch (e) {
      //
    }
  }
  export function getRandomChoice<T>(list: Array<T>): T {
    const randomIndex = Math.floor(Math.random() * list.length);

    return list[randomIndex];
  }
  export function getCurrentBaseUrl(): string {
    return window.location.href.split('/').slice(0, 3).join('/');
  }
  export function textFormat(text: string | number, format: TextFormats): string {
    let result = !text ? '' : String(text);

    if (format === TextFormats.NUMBER) {
      const number = Number(text);

      if (number === 0) {
        result = '0';
      } else if (
        !Number.isNaN(number) &&
        result[result.length - 1] !== '.' &&
        result !== '' &&
        !(result.includes('.') && result[result.length - 1] === '0')
      ) {
        result = number.toLocaleString();
      }
    } else if (format === TextFormats.PRICE) {
      const number = CommonUtils.textFormat(text, TextFormats.NUMBER);
      result = `${number}원`;
    } else if (format === TextFormats.KOREAN_NUMBER_SIMPLE) {
      const number = Number(text);
      if (number <= 0) return String(text);

      const units = ['', '만', '억', '조', '경', '해'];
      const unitIndex = Math.floor(Math.log10(number) / 4);
      const unit = units[unitIndex];
      const value = number / 10 ** (unitIndex * 4);

      result = `${value.toFixed(0)}${unit}`;
    }

    if (!result) {
      result = '';
    }

    return result;
  }
  export function isValidPassword(value: string): boolean {
    if (!value) {
      return false;
    }

    // 정규식: 최소 6자리, 영문자와 숫자 포함
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(value);
  }
  // export function getMoment(dateString: string | null): Moment {
  //   const m = new moment(dateString);
  //   return m;
  // }
  export function getDayjs(date: string | Date | number): Dayjs {
    return dayjs(date);
  }
  export function setTextareaAutoHeight(e: any) {
    const element = e.target;

    if (!element) {
      return;
    }

    element.style.height = 'auto';
    element.style.height = `${Number(element.scrollHeight) + 4}px`;
  }
  export function debounce(func: () => void, delay: number) {
    let timeout: NodeJS.Timeout | null = null;
    return function (...args: any[]) {
      if (timeout) clearTimeout(timeout);
      // @ts-ignore
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }
}

export default CommonUtils;
