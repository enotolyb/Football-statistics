import { League } from './league';

export interface LeaguesResponse {
  count: number;
  competitions: League[];
}
