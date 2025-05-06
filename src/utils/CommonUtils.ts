import { TextFormats } from "@/types/CommonTypes";
import dayjs from "dayjs";
import moment, { Moment } from "moment";
import "moment/locale/ko";

export default class CommonUtils {
  static round(value: number, round: number = 0): number {
    // return Math.round(value * Math.pow(10, round)) / Math.pow(10, round)
    return Number(value.toPrecision(round));
  }
  static getRandomEnumValue<T>(enumeration: T): T[keyof T] {
    const enumValues = Object.values(enumeration);
    const randomIndex = Math.floor(Math.random() * enumValues.length);
    return enumValues[randomIndex];
  }
  static getRandomChoice<T>(list: Array<T>): T {
    const randomIndex = Math.floor(Math.random() * list.length);

    return list[randomIndex];
  }
  static getCurrentBaseUrl(): string {
    return window.location.href.split("/").slice(0, 3).join("/");
  }
  static async copyClipboard(value: string): boolean {
    try {
      await navigator.clipboard.writeText(value);
    } catch (e) {
      return false;
    }
    return true;
  }
  static sha256(value: string): string {
    const hash = crypto.createHash("sha256");
    hash.update(value);
    return hash.digest("hex");
  }
  static textFormat(text: string, format: TextFormats): string {
    let result = text;

    if (format === TextFormats.NUMBER) {
      const number = Number(text);
      if (!isNaN(number)) {
        result = number.toLocaleString();
      }
      // // 숫자를 문자열로 변환
      // let numStr = text.toString()

      // // 정수 부분과 소수 부분 분리
      // const parts = numStr.split(".")
      // const integerPart = parts[0]
      // const decimalPart = parts[1] || ""

      // // 정수 부분에 콤마 추가
      // const integerWithCommas = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

      // // 소수 부분과 합치기
      // result =
      //     decimalPart || text[text.length - 1] === "." ? `${integerWithCommas}.${decimalPart}` : integerWithCommas
      // console.log(decimalPart)
    } else if (format === TextFormats.PRICE) {
      const number = CommonUtils.textFormat(text, TextFormats.NUMBER);
      result = number + "원";
    }

    if (!result) {
      result = "";
    }

    return result;
  }
  static textFormatInput(text: string, format: TextFormats): string {
    let result = text;

    if (format === TextFormats.NUMBER) {
      result = text.replaceAll(",", "");
    } else if (format === TextFormats.NUMBER_ONLY) {
      result = text.replace(/[^0-9]/g, "");
    } else if (format === TextFormats.PRICE) {
      // 미구현
      const number = CommonUtils.textFormatInput(text, TextFormats.NUMBER);
      result = number.replaceAll("원", "");
    } else if (format === TextFormats.TEL) {
      result = CommonUtils.telFormat(text);
    }

    return result;
  }
  static isValidPassword(value: string): boolean {
    // 정규식: 최소 6자리, 영문자와 숫자 포함
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    return regex.test(value);
  }
  // 현재 사용안함
  static relativeDateTime(dateString: string): string {
    const datetime = dayjs(dateString);

    if (!datetime.isValid()) {
      return "-";
    }

    const now = dayjs();
    const oneMonthAgo = now.subtract(30, "day");

    if (datetime.isBefore(oneMonthAgo)) {
      // 1달 보다 전이면 날짜로 표기
    } else {
      // 1달 이내면 상대날짜로 표기
    }
  }
  static getMoment(dateString: string | null): Moment {
    const m = new moment(dateString);
    return m;
  }
  static setTextareaAutoHeight(e: any) {
    const element = e.target;

    if (!element) {
      return;
    }

    element.style.height = "auto";
    element.style.height = Number(element.scrollHeight) + 4 + "px";
  }
  static debounce(func: () => void, delay: number) {
    let timeout: NodeJS.Timeout | null = null;
    return function (...args: any[]) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }
}
