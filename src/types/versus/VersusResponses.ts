export interface IVersusGameResultResponse {
  allCount: number;
  answers: Array<{
    _id: string;
    count: number;
  }>;
}
