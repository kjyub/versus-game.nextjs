namespace TypeUtils {
  export function percent(value: number, round = 0): string {
    return `${Math.round(value * 100 * 10 ** round) / 10 ** round}%`;
  }
  export function round(value: number, round = 0): number {
    return Number(value.toPrecision(round));
  }
}

export default TypeUtils;
