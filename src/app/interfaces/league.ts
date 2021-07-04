export interface League {
  id: number;
  name: string;
  area: {
    id: number;
    name: string;
  };
  currentSeason: {
    id: number;
    startDate: string;
    endDate: string;
  };
}
