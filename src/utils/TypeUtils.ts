export default class TypeUtils {
  static percent(value: number, round: number = 0): string {
    return Math.round(value * 100 * Math.pow(10, round)) / Math.pow(10, round) + '%'
  }
  static round(value: number, round: number = 0): number {
    // return Math.round(value * Math.pow(10, round)) / Math.pow(10, round)
    return Number(value.toPrecision(round))
  }
}
