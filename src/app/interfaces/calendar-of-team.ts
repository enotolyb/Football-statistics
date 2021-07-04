export interface CalendarOfTeam {
  id: number;
  competition: {
    id: number,
    name: string,
  };
  utcDate: string;
  homeTeam: {
    id: number,
    name: string,
  };
  awayTeam: {
    id: number,
    name: string,
  };
  score: {
    fullTime: {
      homeTeam: number,
      awayTeam: number,
    },
  };
}
