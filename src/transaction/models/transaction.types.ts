export type ReportData = {
  monyear: string;
  source: string;
  sum: number;
}

export type ReportResult = {
  source: string;
  data: {date: string; total: number}[];
}